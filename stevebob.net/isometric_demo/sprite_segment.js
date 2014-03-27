function SpriteSegment(image, position, start, end){
    this.image = image;
    this.position = position;
    this.start = start;
    this.end = end;
    this.amount = end - start;
    this.width = this.amount * this.image.width;
}
SpriteSegment.create = function(image, position, start, end) {
    return new SpriteSegment(image, position, start, end);
}
$SS = SpriteSegment.create;
