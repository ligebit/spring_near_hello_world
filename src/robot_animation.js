module.exports = class ROBOT_ANIMATION {

    constructor() {
        this.canvas = document.getElementById('robot');
        this.ctx = this.canvas.getContext('2d');
    }

    async load() {
        const eyeImage = await ROBOT_ANIMATION.addImageProcess(require('./eye.png'));
        this.robot = await ROBOT_ANIMATION.addImageProcess(require('./robot.png'));

        this.rightEye = new EYE(this.ctx, 95, 93, eyeImage);
        this.leftEye = new EYE(this.ctx, 163, 93, eyeImage);

        this.isLoaded = true;
    }

    calculateRadian(mouse) {
        this?.rightEye?.calculateRadian(mouse);
        this?.leftEye?.calculateRadian(mouse);
    }

    draw() {
        if(this.isLoaded) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.drawImage(this?.robot, 0, 0, 300, 365);
            this.rightEye.draw(this.ctx);
            this.leftEye.draw(this.ctx);
        }
    }

    static addImageProcess(src, width, height) {
        return new Promise((resolve, reject) => {
            let img = new Image(width, height);
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
            img.src = src;
        })
    }


}



const EYE_SIZE = 46;

class EYE {
    constructor(ctx, eyeX, eyeY, image) {
        this.ctx = ctx;
        this.eyeX = eyeX;
        this.eyeY = eyeY;
        this.image = image;
        this.rotation = 0;
    }

    calculateRadian(mouse) {
        let mouseX = (this.ctx.canvas.getBoundingClientRect().left) + this.eyeX + EYE_SIZE/2;
        let mouseY = (this.ctx.canvas.getBoundingClientRect().top) + this.eyeY + EYE_SIZE/2;;
    
        this.rotation = -Math.atan2(mouse.pageX - mouseX, mouse.pageY - mouseY);
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.eyeX + EYE_SIZE/2, this.eyeY + EYE_SIZE/2);
        this.ctx.rotate(this.rotation);
        this.ctx.drawImage(this.image, -EYE_SIZE/2, -EYE_SIZE/2, EYE_SIZE, EYE_SIZE);
        this.ctx.restore();
    }
}