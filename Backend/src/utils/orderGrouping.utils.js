
/* ────────────────────────────────────────────────────────────────────
 *  HELPERS
 *  ------------------------------------------------------------------
 *  New DB columns
 *    • building      – eg. "SCIS"
 *    • room_type     – eg. "seminar", "gsr", "meetingpod"  (see ROOM_TYPES)
 *    • room_number   – string like "4-30"  (floor 4, room 30)
 *
 *  Key format we’ll use everywhere in clustering:
 *      `${building}-${room_type}-${room_number}`
 *      e.g. "SCIS-seminar-4-30"
 *  ────────────────────────────────────────────────────────────────── */

/** Cost surrogate for how much farther a runner walks when two
 *  destinations differ in one or more attributes.
 *
 *  100  : different buildings        (largest hassle)
 *   10  : floor gap per storey       (medium hassle)
 *    5  : different room types       (pods vs seminar rooms etc.)
 *    1  : door-to-door distance on the **same** floor & type
 */
function roomDistance(roomA, roomB) {
  let score = 0;
  if (roomA.building   !== roomB.building)   score += 100;                // building penalty
  if (roomA.room_type  !== roomB.room_type)  score += 5;                  // type penalty
  score += Math.abs(roomA.floor - roomB.floor) * 10;                      // floor penalty
  score += Math.abs(roomA.room_number - roomB.room_number);               // door distance
  //console.log(`[DEBUG] ${score}`)
  return score;
}

/** Build a *canonical* string key for one order’s destination */
function extractRoomKey(order) {
  // order.room_number already looks like "4-30"
  return `${order.building}-${order.room_type}-${order.room_number}`;
}

/** Parse a key back into its structured pieces so the distance
 *  function can read numeric floor / room_no and compare strings. */
function parseKey(key) {
  // key looks like  "<building>-<room_type>-<floor>-<room>"
  // room_type may itself contain dashes, so we grab from the *right*.
  const parts = key.split('-');

  const roomStr  = parts.pop();          // last element
  const floorStr = parts.pop();          // second-last
  const building = parts.shift();        // first element
  const roomType = parts.join('-');      // everything in between

  return {
    building,
    room_type  : roomType,
    floor      : Number(floorStr),
    room_number: Number(roomStr)
  };
}



// TSP utilities (nearest0neightbour + 2-opt)
function nearestNeighbourTour(idxArr, dist) {
  if (idxArr.length <= 1) return idxArr.slice();

  const tour = [idxArr[0]];
  const unused = new Set(idxArr.slice(1));

  while (unused.size) {
    const last = tour[tour.length - 1];
    let best, bestD = Infinity;
    for (const j of unused) {
      if (dist[last][j] < bestD) { bestD = dist[last][j]; best = j; }
    }
    tour.push(best);
    unused.delete(best);
  }
  return tour;
}

function twoOpt(tour, dist, maxPasses = 50) {
  let improved = true, pass = 0;
  const n = tour.length;
  while (improved && pass++ < maxPasses) {
    improved = false;
    for (let i = 0; i < n - 2; i++) {
      for (let k = i + 2; k < n - (i === 0 ? 1 : 0); k++) {
        const a = tour[i],   b = tour[(i + 1) % n];
        const c = tour[k],   d = tour[(k + 1) % n];
        const delta = (dist[a][c] + dist[b][d]) - (dist[a][b] + dist[c][d]);
        if (delta < -1e-6) {                       // improvement
          tour.splice(i + 1, k - i, ...tour.slice(i + 1, k + 1).reverse());
          improved = true;
        }
      }
    }
  }
  return tour;
}


function tourCost(tour, dist, weights) {
  let cost = 0;
  for (let i = 0; i < tour.length; i++) {
    const from = tour[i], to = tour[(i + 1) % tour.length];
    cost += dist[from][to] * (weights?.[from] ?? 1);   // weight at origin
  }
  return cost;
}


/**
 * ──────────────────────────────────────────────────────────────────────────
 *  kMedoidsWeighted
 *  ------------------------------------------------------------------------
 *  Find **k medoids** (actual data points) that minimise the *weighted*
 *  sum-of-distances from every point to its nearest medoid.  This is the
 *  classic PAM algorithm (“Partitioning Around Medoids”) with:
 *
 *    • **k-medoids++ seeding**   – smarter, spread-out initial centres
 *    • **weights**               – popular points pull harder
 *    • **multiple restarts**     – pick the cheapest of N random starts
 *
 *  High-level algorithm
 *  --------------------
 *  FOR each restart
 *    1.  k-medoids++ initialisation
 *    2.  PAM loop (≤ maxIters)
 *        a. ASSIGN  every point ➜ nearest current medoid
 *        b. UPDATE  within each cluster: swap in the point that gives the
 *                   lowest weighted intra-cluster cost
 *        c. Repeat until no cluster changes medoid or maxIters reached
 *    3.  Remember the restart with the lowest global cost
 *  RETURN the best set of medoids and per-point assignments
 *
 *  Time complexity (worst-case)
 *      O(restarts · maxIters · k · R²)
 *          R  = #unique points (rooms)
 *          k  = #clusters (runners)
 *  With R ≲ 200 and k ≈ 5 this is ≪ 1 ms in practice because distances are
 *  pre-cached and the constants are small.
 *
 *  @param {Object}   cfg                       – single config object
 *  @param {Array}    cfg.points               – length-R array of room objects
 *                                                [{ building, floor, room_number }, …]
 *  @param {number}   cfg.k                    – desired #clusters / runners
 *  @param {number[][]} cfg.dist               – R × R symmetric distance matrix
 *                                                dist[i][j] = walking cost between points[i], points[j]
 *  @param {number[]} cfg.weights              – length-R array, weight for each point
 *                                                (e.g. #orders delivered there)
 *  @param {number} [cfg.maxIters=20]          – PAM iterations per restart
 *  @param {number} [cfg.restarts=10]          – independent k-medoids++ seeds
 *
 *  @returns {Object}
 *           ├─ medoids : number[]   indices of the chosen medoid points (length k)
 *           └─ assign  : number[]   length-R array; assign[i] = cluster index (0…k-1)
 *
 *  Example
 *  -------
 *      const { medoids, assign } = kMedoidsWeighted({
 *        points,                // from parseKey on all roomKeys
 *        k: 5,                  // 5 runners
 *        dist,                  // pre-built distance matrix
 *        weights,               // order counts per room
 *        maxIters: 20,          // optional
 *        restarts: 10           // optional
 *      });
 *
 *  The caller can then map `medoids` back to roomKeys and build TSP routes
 *  within each cluster using the same `dist` matrix.
 * ──────────────────────────────────────────────────────────────────────────
 */
function kMedoidsWeighted({ points, k, dist, weights, maxIters, restarts }) {
  const R = points.length;
  // gets an array of numbers from 0 to R-1
  const allIdx = [...Array(R).keys()];

  let bestMedoids, bestAssign, bestCost = Infinity;

  // iterate "restart" times, use the best one
  for (let restart = 0; restart < restarts; restart++) {
    // -- k-medoids++ seeding ------------------------------------------
    const medoids = [];
    // randomly pick a medoid
    medoids.push(allIdx[Math.floor(Math.random() * R)]);
    // all subsequent medoids are chosen based on distance from closest existing centre (to prefer far away points)
    // and also considers weights so that rooms with many orders are likely to be centres
    while (medoids.length < k) {
      // for point i, compute distance from every already chosen medoid and take the smallest, then exaggerate it
      const d2 = allIdx.map(i =>
        Math.min(...medoids.map(m => dist[i][m])) ** 2 * weights[i]);
      // get probability
      const total = d2.reduce((a, b) => a + b, 0);
      // roulette wheel sampling (line them up, then choose a random number from 0 to total)
      let r = Math.random() * total, idx = 0;
      while ((r -= d2[idx]) > 0) idx++;
      medoids.push(idx);
    }

    // Medoids created, assign points to clusters
    // -- PAM iterations (assign, update, repeat) -----------------------------------------------
    let changed = true,  // flag: did any medoid move in the last round?
        iter    = 0,     // how many PAM iterations so far
        assign;          // tells u which cluster a point belongs to (e.g. assign[7]===2 means point 7 in cluster 2)
    const medoidOf = idx => medoids.reduce((best, m, ci) =>
      dist[idx][m] < best.d ? { d: dist[idx][m], ci } : best,
      { d: Infinity, ci: -1 }).ci;
    

    while (changed && iter++ < maxIters) {
      // assignment
      //assign = allIdx.map(medoidOf);
      assign = allIdx.map(idx => {
        const ci = medoidOf(idx);
        //console.log(`[DEBUG] point ${idx} → cluster ${ci}`);
        return ci;
      })

      changed = false;
      for (let ci = 0; ci < k; ci++) {
        const clusterPts = allIdx.filter(i => assign[i] === ci);
        if (clusterPts.length === 0) continue;

        let bestMedoid = medoids[ci], bestCostCi = Infinity;
        for (const cand of clusterPts) {
          const c = clusterPts.reduce((sum, i) =>
            sum + dist[i][cand] * weights[i], 0);
          if (c < bestCostCi) { bestCostCi = c; bestMedoid = cand; }
        }
        if (bestMedoid !== medoids[ci]) {
          medoids[ci] = bestMedoid;
          changed = true;
        }
      }
    }

    // total cost
    const cost = allIdx.reduce((sum, i) =>
      sum + dist[i][medoids[assign[i]]] * weights[i], 0);

    if (cost < bestCost) {
      bestCost = cost; bestMedoids = [...medoids]; bestAssign = assign;
    }
  }

  return { medoids: bestMedoids, assign: bestAssign };
}



/* ──────────────────────────────────────────────────────────────────────────
 *  rebalanceClusters
 *  ------------------------------------------------------------------------
 *  Purpose
 *  -------
 *  After k-medoids minimises total walking distance, the workload (#orders)
 *  can still be uneven (e.g. one runner 100 orders, another 10).  
 *  This helper moves whole *rooms* from the heaviest cluster(s) to the
 *  lightest until every runner’s load is within `±slack` of the ideal.
 *
 *  Strategy  (greedy, O(rooms²) worst-case, ≲ milliseconds for ≤200 rooms)
 *  ----------------------------------------------------------------------
 *  1. Compute target load  ideal = totalOrders / k.
 *  2. While ∃ cluster with orders > ideal+slack  *and* one with
 *     orders < ideal-slack:
 *        a. pick the CURRENT heaviest cluster H and lightest cluster L;
 *        b. in H, find the room whose transfer to L causes the smallest
 *           increase in walking distance  Δd = dist[H.center][room] -
 *           dist[L.center][room];
 *        c. move that room (and all its orders) from H to L.
 *  3. Return the now-balanced clusters (mutated in place).
 *
 *  @param {Array<Object>} clusters   – output of clusterOrdersOptimal()
 *  @param {number[][]}    dist       – the same R×R distance matrix
 *  @param {number}        ideal      – target #orders per runner
 *  @param {number} [slack=5]         – tolerance before we start rebalancing
 *  @returns {Array<Object>}          – balanced clusters (same reference)
 * ────────────────────────────────────────────────────────────────────────── */
function rebalanceClusters(clusters, dist, ideal, slack = 5) {
  // Helper: rebuild heavy/light arrays each iteration
  const splitHL = () => {
    const heavy = clusters.filter(c => c.orders.length > ideal + slack)
                          .sort((a, b) => b.orders.length - a.orders.length);
    const light = clusters.filter(c => c.orders.length < ideal - slack)
                          .sort((a, b) => a.orders.length - b.orders.length);
    return { heavy, light };
  };

  for (let guard = 0; guard < 1e4; guard++) {     // safety-loop cap
    const { heavy, light } = splitHL();
    if (!heavy.length || !light.length) break;    // all balanced ✓

    const H = heavy[0];
    const L = light[0];

    // find the room in H whose move to L adds the least distance
    let bestIdx = -1, bestDelta = Infinity;
    H.rooms.forEach((rk, idx) => {
      const dH = dist[H.centerIdx][H.roomIdxMap[idx]];   // current cost
      const dL = dist[L.centerIdx][H.roomIdxMap[idx]];   // cost if moved
      const delta = dL - dH;
      if (delta < bestDelta) { bestDelta = delta; bestIdx = idx; }
    });

    if (bestIdx === -1) break; // should not happen; safety guard

    const roomKey = H.rooms.splice(bestIdx, 1)[0];
    const transferredOrders = H.orders.filter(o => extractRoomKey(o) === roomKey);
    H.orders = H.orders.filter(o => extractRoomKey(o) !== roomKey);

    L.rooms.push(roomKey);
    L.orders.push(...transferredOrders);
  }

  return clusters;
}


/** ──────────────────────────────────────────────────────────────────────────
 *  clusterOrdersOptimal
 *  ------------------------------------------------------------------------
 *  End-to-end order grouping and runner-route builder for SMUNCH.
 *
 *  WHAT IT DOES
 *  ------------
 *  1. **Bucket orders by destination room**  →  gives us one “node” per room
 *  2. **Compute a walking-distance matrix**  →  constant-time look-ups later
 *  3. **k-medoids clustering (weighted PAM)**  
 *       – minimises   Σ weight × distance-to-cluster-centre
 *       – weights = #orders in that room
 *  4. **TSP path inside each cluster** (nearest-neighbour + 2-opt)  
 *       – produces the actual room-to-room visit sequence for the runner
 *  5. **(optional) Fairness rebalance**  
 *       – moves whole rooms between clusters until every runner’s load is
 *         within ± `slack` orders of the ideal average
 *
 *  PARAMETERS
 *  ----------
 *  @param {Array<Object>} orders          Flat list of order objects.  Each
 *                                         must contain `building`, `floor`,
 *                                         `room_number` (used for grouping).
 *  @param {number}        k               Number of runners → number of
 *                                         clusters we must create.
 *  @param {Object}  [opts]                Optional tuning knobs.
 *        @prop {number} maxIters   = 20   PAM iterations per restart
 *        @prop {number} restarts   = 10   Independent k-medoids++ seeds
 *        @prop {number} tspPasses  = 50   2-opt refinement passes / cluster
 *        @prop {boolean} balance   = true Run workload balancer?
 *        @prop {number}  slack     = 5    Allowed ± orders before balance
 *
 *  RETURNS
 *  -------
 *  Array of **k** cluster objects:
 *    ├─ center      : 'SCIS-2-2'           (medoid room key)
 *    ├─ rooms       : ['SCIS-2-2',…]       (all room keys in cluster)
 *    ├─ orders      : [ …order objects ]   (all orders for those rooms)
 *    ├─ route       : ['SCIS-2-2',…]       (runner visit sequence, TSP)
 *    ├─ distance    : 87                   (walking-cost units, TSP tour)
 *    └─ (internal) roomIdxs / centerIdx    helper indices for balancer
 * ────────────────────────────────────────────────────────────────────────── 
*/
export function clusterOrdersOptimal(
  orders,
  k,
  {
    maxIters = 20,
    restarts = 10,
    tspPasses = 50,
    balance = true,
    slack = 5
  } = {}
) {
  /*
  *1. bucket orders by destination
  Bucket orders by unique room key (put the same destinations tgt)
  Room Buckets will look like 
  {
    "SCIS-2-2": [
        { order_id: 1, building: 'SCIS', floor: 2, room_number: 2, ... },
        { order_id: 7, building: 'SCIS', floor: 2, room_number: 2, ... }
    ],
    "SCIS-3-1": [
        { order_id: 3, building: 'SCIS', floor: 3, room_number: 1, ... }
    ]
  }
  */ 
  const buckets = new Map();
  for (const o of orders) {
    const key = extractRoomKey(o);              // e.g. 'SCIS-3-2'
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(o);
  }
  const roomKeys = [...buckets.keys()];
  const R = roomKeys.length;

  /* Edge case: fewer rooms than runners → give one cluster per room */
  if (R <= k) {
    return roomKeys.map(key => ({
      center: key,
      rooms:  [key],
      orders: buckets.get(key),
      route:  [key],
      distance: 0
    }));
  }

  /* ── 2. Materialise points + weights for clustering ──────────────── */
  // parse the room keys into their attributes (building, floor, room number) so that can calculate
  const points  = roomKeys.map(parseKey);             // room objects
  // not all rooms are the same, more orders in the room means that room more heavy
  const weights = roomKeys.map(k => buckets.get(k).length);

  /* ── 3. Build distance between 2 rooms matrix  (R × R, symmetric) ─────────────────── */
  const dist = Array.from({ length: R }, () => Array(R));
  for (let i = 0; i < R; i++) {
    // diagonal always 0 cos its the distance from itself
    dist[i][i] = 0;
    for (let j = i + 1; j < R; j++) {
      const d = roomDistance(points[i], points[j]);
      dist[i][j] = dist[j][i] = d; //symmetric
    }
  }
  // debugging distance
  // for (let i = 0; i < dist.length; i++) {
  //   for (let j = 0; j < dist[i].length; j++) {
  //     if (!Number.isFinite(dist[i][j])) {
  //       console.error('[BAD DIST]', i, j, roomKeys[i], roomKeys[j], dist[i][j]);
  //     }
  //   }
  // }


  /* ── 4. k-medoids (weighted PAM) to create k clusters ────────────── */
  const { medoids, assign } = kMedoidsWeighted({
    points, k, dist, weights, maxIters, restarts
  });

  /* ── 5. For each cluster build runner package + TSP route ────────── */
  const clusters = medoids.map((mIdx, ci) => {
    // indices of rooms that belong to this cluster
    const roomIdxs = points.flatMap((_, i) => assign[i] === ci ? [i] : []);

    // quick nearest-neighbour start → polish with 2-opt
    const tourIdxs = twoOpt(
      nearestNeighbourTour(roomIdxs, dist),
      dist,
      tspPasses
    );

    return {
      center: roomKeys[mIdx],          // medoid key
      centerIdx: mIdx,                 // index in points / dist
      rooms:  roomIdxs.map(i => roomKeys[i]),
      roomIdxs,                        // save for balancer
      orders: roomIdxs.flatMap(i => buckets.get(roomKeys[i])),
      route:  tourIdxs.map(i => roomKeys[i]),
      distance: tourCost(tourIdxs, dist, weights)
    };
  });

  /* ── 6. Optional fairness rebalance (greedy room swaps) ──────────── */
  if (balance) {
    const totalOrders = orders.length;
    const ideal = totalOrders / k;
    rebalanceClusters(clusters, dist, ideal, slack);
  }

  return clusters;
}