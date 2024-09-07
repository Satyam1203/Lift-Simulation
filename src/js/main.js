
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
    // alert("LIFT REQUESTED: ", floor, forDirection)
    // requestedFloorQueue.value = requestedFloorQueue.value.push({floor, forDirection});
    moveLift(1, floor, forDirection);
}

function moveLift(id, floor, forDirection) {
    if (!liftsStatus[id].isAvailable) {
        return;
    }

    liftsStatus[id].isAvailable = false;
    liftsStatus[id].direction = forDirection;

    const lift = document.querySelector(`[data-lift-id="${id}"]`);
    const clickedBtn = document.getElementById(`${floor}-${forDirection}`);
    const duration = 2000 * Math.abs(floor - liftsStatus[id].currentFloor);

    lift.style.transitionDuration = `${duration}ms`;
    lift.style.bottom = `${floor * 150}px`;

    liftsStatus[id].currentFloor = floor;
    clickedBtn.classList.toggle("button-disabled");

    const cb = () => {
        clickedBtn.classList.toggle("button-disabled");
        liftsStatus[id].isAvailable = true;        
    }

    setTimeout(() => openLiftDoors(id, cb), duration);
}