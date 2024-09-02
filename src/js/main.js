function generateLiftAndFloors() {
    const liftCount = document.getElementById("lift-count").valueAsNumber || 2;
    const floorCount = document.getElementById("floor-count").valueAsNumber || 4;
    const liftsAndFloorWrapper = document.getElementById("lifts");
    console.log(liftCount, floorCount);

    liftsAndFloorWrapper.innerHTML = "";
    liftsAndFloorWrapper.appendChild(createFloor(floorCount));
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

    console.log(frag)

    return frag;
}