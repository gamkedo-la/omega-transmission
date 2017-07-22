function WrapComponent(parent) {

    //Screen wrap will probably become a special feature of specific ships/power-ups
    //Will replace this component with a standard movement component for all basic units
    this.handleScreenWrap = function () {
        if (parent.x < 0) {
            parent.x += virtualWidth;
        } else if (parent.x >= virtualWidth) {
            parent.x -= virtualWidth;
        }

        if (parent.y < 0) {
            parent.y += virtualHeight;
        } else if (parent.y >= virtualHeight) {
            parent.y -= virtualHeight;
        }
    };

    this.reset = function () {
        parent.xv = 0.0;
        parent.yv = 0.0;
        parent.x = virtualWidth / 2;
        parent.y = virtualHeight / 2;
    };

    this.move = function () {
        parent.x += parent.xv;
        parent.y += parent.yv;
        this.handleScreenWrap();
    };
}

