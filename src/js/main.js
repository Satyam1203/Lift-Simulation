
let liftCount = 2; // Default values
let floorCount = 4; // Default values
let customLiftSpeed = null;
const requestedFloorQueue = new Set(); // stores id of lifts for which requests cannot be catered at the moment bcoz lifts are already serving other floors
const runningRequests = new Set(); // requests for lifts which are currently being catered
const liftsStatus = {};
const liftDirection = { UP: "UP", DOWN: "DOWN" }
const defaultLiftProps = {
    direction: liftDirection.UP,
    currentFloor: 0,
    isAvailable: true
}

function generateLiftAndFloors() {
    liftCount = document.getElementById("lift-count").valueAsNumber;
    floorCount = document.getElementById("floor-count").valueAsNumber;

    if (!liftCount || !floorCount) {
        return;
    }

    const liftsAndFloorWrapper = document.getElementById("lifts-area");
    console.log(liftCount, floorCount);

    liftsAndFloorWrapper.innerHTML = "";
    liftsAndFloorWrapper.appendChild(createFloor(floorCount));
    liftsAndFloorWrapper.appendChild(createLifts(liftCount));
}

function createFloor(floorCount) {
    const frag = document.createElement("div");

    for (let count = floorCount - 1; count >= 0; count--) {
        const floorHTML = `
            <div class="floor">
                <div class="controls">
                    ${count < floorCount - 1 ? `<button id=${count+"-UP"} onClick="requestLift(${count}, 'UP')">UP &#8673;</button>` : ""}
                    ${count > 0 ? `<button id=${count+"-DOWN"} onClick="requestLift(${count}, 'DOWN')">DOWN &#8675;</button>` : ""}
                </div>
                <div class="floor-identifier">Floor: ${count}</div>
                <div class="lift-area"></div>
            </div>
        `;

        frag.innerHTML += floorHTML;
    }

    return frag;
}

function createLifts(liftCount) {
    const frag = document.createElement("div");

    for (let count = liftCount - 1; count >= 0; count--) {
        const liftHTML = `
            <div data-lift-id="${liftCount - count - 1}" class="lift" style="left: ${(liftCount - count) * 105}px">
                <div class="lift-door"></div>
                <div class="lift-door"></div>
            </div>
        `;

        frag.innerHTML += liftHTML;
        liftsStatus[count] = {...defaultLiftProps};
    }

    console.log(frag)

    return frag;
}

function openLiftDoors(id, cb) {
    const liftDoor = document.querySelectorAll(`[data-lift-id="${id}"] .lift-door`);
    liftDoor[0].style.transform = "translateX(-95%)";
    liftDoor[1].style.transform = "translateX(95%)";
    setTimeout(() => closeLiftDoors(id, cb), 3000); // Doors open at 2500ms and stay open for 500ms
}

function closeLiftDoors(id, cb) {
    const liftDoor = document.querySelectorAll(`[data-lift-id="${id}"] .lift-door`);
    liftDoor[0].style.transform = "translateX(0)";
    liftDoor[1].style.transform = "translateX(0)";

    setTimeout(cb, 2500);
}

function requestLift(floor, forDirection) {
    // If any lift is present at current floor already, don't do anything
    // const allLiftsPositions = Object.values(liftsStatus);
    // if (allLiftsPositions.some(({currentFloor}) => currentFloor == floor )) {
    //     return;
    // }
    const clickedBtn = document.getElementById(`${floor}-${forDirection}`);
    if (clickedBtn.classList.contains("button-disabled")) {
        return;
    }

    clickedBtn.classList.toggle("button-disabled");

    let closestAvailableLiftDist = Infinity;
    let closestAvailableLiftId = -1;
    for (i = 0; i < liftCount; i++) {
        if (liftsStatus[i].isAvailable) {
            let distance = Math.abs(floor - liftsStatus[i].currentFloor);
            if (distance < closestAvailableLiftDist) {
                closestAvailableLiftDist = distance;
                closestAvailableLiftId = i;
            }
        }
    }

    if (closestAvailableLiftId > -1) {
        moveLift(closestAvailableLiftId, floor, forDirection);
        runningRequests.add(floor);
    } else {
        let isAddedinQueue = false;
        requestedFloorQueue.forEach(item => {
            if (item.floor === floor) {
                isAddedinQueue = true;
            }
        });
        if (!isAddedinQueue) {
            requestedFloorQueue.add({ floor, forDirection });
            updatePendingLiftRequests();
        }
    }
}

function removeClassIfPresent(element) {
    if (element && element.classList.contains("button-disabled")) {
        element.classList.remove("button-disabled");
    }
}

function moveLift(id, floor, forDirection) {
    if (!liftsStatus[id].isAvailable) {
        return;
    }

    liftsStatus[id].isAvailable = false;
    liftsStatus[id].direction = forDirection;

    const lift = document.querySelector(`[data-lift-id="${id}"]`);
    const floorBtnUp = document.getElementById(`${floor}-${liftDirection.UP}`);
    const floorBtnDown = document.getElementById(`${floor}-${liftDirection.DOWN}`);
    const defaultDuration = 2000 * Math.abs(floor - liftsStatus[id].currentFloor);
    const liftsTransitionDuration = customLiftSpeed ? Math.min(defaultDuration, customLiftSpeed) : defaultDuration;

    lift.style.transitionDuration = `${liftsTransitionDuration}ms`;
    lift.style.bottom = `${floor * 150}px`;

    liftsStatus[id].currentFloor = floor;

    const cb = () => {
        removeClassIfPresent(floorBtnUp);
        removeClassIfPresent(floorBtnDown);

        liftsStatus[id].isAvailable = true;
        runningRequests.delete(id);
        if (requestedFloorQueue.size > 0) {
            const [first] = requestedFloorQueue;
            requestedFloorQueue.delete(first);
            updatePendingLiftRequests();
            moveLift(id, first.floor, first.forDirection);
        }
    }

    setTimeout(() => openLiftDoors(id, cb), liftsTransitionDuration);
}

function updatePendingLiftRequests() {
    let queueHtml = `<div>`;
    queueHtml += `Pending lift requests:`;
    requestedFloorQueue.forEach(item => {
        queueHtml += `<span class="queue-item">${item.floor}</span>`;
    })
    queueHtml += `</div>`;

    document.getElementById("pending-lift-requests").innerHTML = queueHtml;
}

function liftsSpeedChange(goFast) {
    customLiftSpeed = goFast ? 5000 : null;
}