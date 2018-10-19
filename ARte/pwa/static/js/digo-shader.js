if (typeof AFRAME === 'undefined') {
    throw 'Component attempted to register before AFRAME was available.'
}

AFRAME.registerComponent('draw-canvas', {
    schema: {
        default: ''
    },

    init: function () {
      this.canvas = document.getElementById(this.data);
      this.ctx = this.canvas.getContext('2d');
    },
});