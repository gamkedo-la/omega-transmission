function WrapComponent(parent) {

    //Screen wrap will probably become a special feature of specific ships/power-ups
    //Will replace this component with a standard movement component for all basic units
    this.handleScreenWrap = function () {
        if (parent.x < 0) {
            parent.x += canvas.width;
        } else if (parent.x >= canvas.width) {
            parent.x -= canvas.width;
        }

        if (parent.y < 0) {
            parent.y += canvas.height;
        } else if (parent.y >= canvas.height) {
            parent.y -= canvas.height;
        }
    }

    this.reset = function () {
        parent.xv = 0.0;
        parent.yv = 0.0;
        parent.x = canvas.width / 2;
        parent.y = canvas.height / 2;
    }

    this.move = function () {
        parent.x += parent.xv;
        parent.y += parent.yv;
        this.handleScreenWrap();
    }
}