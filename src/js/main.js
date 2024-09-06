
const requestedFloorQueue = [];
const liftsStatus = {};
const liftDirection = { UP: "UP", DOWN: "DOWN" }
const defaultLiftProps = {
    direction: liftDirection.UP,
    currentFloor: 0,
    isAvailable: true
}

function generateLiftAndFloors() {
    const liftCount = document.getElementById("lift-count").valueAsNumber || 2;
    const floorCount = document.getElementById("floor-count").valueAsNumber || 4;
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
                    ${count < floorCount - 1 ? `<button onClick="requestLift(${count}, 'UP')">UP</button>` : ""}
                    ${count > 0 ? `<button onClick="requestLift(${count}, 'DOWN')">DOWN</button>` : ""}
                </div>
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
            <div data-lift-id="${liftCount - count}" class="lift" style="left: ${(liftCount - count) * 120}px">
                <div class="lift-door"></div>
                <div class="lift-door"></div>
            </div>
        `;

        frag.innerHTML += liftHTML;
        liftsStatus[count] = defaultLiftProps;
    }

    console.log(frag)

    return frag;
}

function openLiftDoors(id) {
    const liftDoor = document.querySelectorAll(`[data-lift-id="${id}"] .lift-door`);
    liftDoor[0].style.transform = "translateX(-95%)";
    liftDoor[1].style.transform = "translateX(95%)";
    setTimeout(() => closeLiftDoors(id), 3000); // Doors open at 2500ms and stay open for 500ms
}

function closeLiftDoors(id) {
    const liftDoor = document.querySelectorAll(`[data-lift-id="${id}"] .lift-door`);
    liftDoor[0].style.transform = "translateX(0)";
    liftDoor[1].style.transform = "translateX(0)";

    liftsStatus[id].isAvailable = true;
}

function requestLift(floor, forDirection) {
    // alert("LIFT REQUESTED: ", floor, forDirection)
    // requestedFloorQueue.value = requestedFloorQueue.value.push({floor, forDirection});
    moveLift(1, floor);
}

function moveLift(id, floor) {
    if (!liftsStatus[id].isAvailable) {
        return;
    }

    liftsStatus[id].isAvailable = false;
    liftsStatus[id].direction = floor > liftsStatus[id].currentFloor ? liftDirection.UP : liftDirection.DOWN;

    const lift = document.querySelector(`[data-lift-id="${id}"]`);
    const duration = 2000 * Math.abs(floor - liftsStatus[id].currentFloor);
    lift.style.transitionDuration = `${duration}ms`;
    lift.style.bottom = `${floor * 150}px`;

    liftsStatus[id].currentFloor = floor;
    setTimeout(() => openLiftDoors(id), duration);
}