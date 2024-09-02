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
                    ${count < floorCount - 1 ? "<button>UP</button>" : ""}
                    ${count > 0 ? "<button>DOWN</button>" : ""}
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
}