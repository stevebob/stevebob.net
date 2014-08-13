s1 = null
l1 = null
cam = null
o = null
w = null
v = null
h4d = null

reset = ->
    h4d = new Hero4D(3, 1500, 1500, 2)
    o = h4d.toObject()

$ ->
    w = new Three.World3D()
    v = new Three.Viewer()
    
    cam = new Three.Camera3D(null, 10)
    cam.world = w
    cam.registerViewer v

    cam.moveForward -10
    cam.moveRight -10
    cam.rotateY Math.PI/4
    l1 = $LS4D(($V [0, 0, 0, 1]), ($V [0, 0, 0, 0]))
    
    s1 = $S4D(($V [0, 0, 0, 0]), ($V [1, 0, 0, 0]), ($V [0, 1, 0, 0]), ($V [0, 0, 1, 0]))
#    s1.rotateXW Math.PI/18
#    ThreeDrawer.drawObject Three.Object3D.unitCube()

    o = Object4D.unitHyperCube()
    g = () ->
      o3 = new Three.Object3D()
      for edge in o.edges
        pts = [edge.e1, edge.e2]
        projPts = pts.map (pt) ->
          pt3 = $V(pt.elements[0..2])
          for i in [0..2]
            pt3.elements[i] = pt3.elements[i] /  (s1.p.elements[3] - pt.elements[3])
          return new Three.Point3D(pt3.elements[0], pt3.elements[1], pt3.elements[2])
        o3.points[o3.points.length] = projPts[0]
        o3.points[o3.points.length] = projPts[1]
        o3.edges[o3.edges.length] = new Three.Edge projPts[0], projPts[1]

      ThreeDrawer.drawObject o3
      setTimeout g, 30
    h4d = new Hero4D(3, 1500, 1500, 2)

    o = h4d.toObject()
    console.debug o
    h = () ->
      o3 = new Three.Object3D()
      for pt in o.points
        
        pt3 = $V(pt.elements[0..2])
        dist4d = s1.p.elements[3] - pt.elements[3]
        for i in [0..2]
          pt3.elements[i] = pt3.elements[i] / dist4d
        projPts = new Three.Point3D(pt3.elements[0], pt3.elements[1], pt3.elements[2])
        projPts.style = get_colour dist4d, -3, 3
        
        o3.points[o3.points.length] = projPts
      
      h4d.progress()
      ThreeDrawer.drawObject o3
      setTimeout h, 20
    
    h()

    avatar = new Avatar  (x, y) ->

    avatar.bindControls()
    avatar.loop()


class Avatar
  constructor: (@moveTo) ->
    @x = 0
    @y = 0
    @moveUp = false
    @moveDown = false
    @moveLeft = false
    @moveRight = false

    @turnLeft = false
    @turnRight = false

    @upVelocity = 0
    @rightVelocity = 0
    @maxVelocity = 2

    @deceleration = 4
    @acceleration = 2

    @increaseW = false
    @decreaseW = false

    @turnPosXW = false
    @turnNegXW = false
    @turnPosYW = false
    @turnNegYW = false
    @turnPosZW = false
    @turnNegZW = false
    @turnPosXY = false
    @turnNegXY = false
    @turnPosXZ = false
    @turnNegXZ = false
    @turnPosYZ = false
    @turnNegYZ = false
    

  bindControls: ->
    self = this
    document.onkeydown = (event) ->
      console.debug event.keyCode
      switch event.keyCode
        when 37
          self.turnLeft = true
        when 39
          self.turnRight = true
        when 38, 188, 87
          self.moveDown = true
        when 40, 79, 83
          self.moveUp = true
        when 68, 69
          self.moveRight = true
        when 65
          self.moveLeft = true

        when 89
          self.increaseX = true
        when 70
          self.increaseY = true
        when 71
          self.increaseZ = true
        when 67, 73
          self.increaseW = true
        when 84, 75
          self.decreaseW = true
        when 80, 82
          reset()
        when 49
          self.turnPosXW = true
        when 50
          self.turnNegXW = true

        when 51
          self.turnPosYW = true
        when 52
          self.turnNegYW = true

        when 53
          self.turnPosZW = true
        when 54
          self.turnNegZW = true
        
        when 55
          self.turnPosXY = true
        when 56
          self.turnNegXY = true
        when 57
          self.turnPosXZ = true
        when 48
          self.turnNegXZ = true
        when 219, 189
          self.turnPosYZ = true
        when 221, 187
          self.turnNegYZ = true
        


    document.onkeyup = (event) ->
      switch event.keyCode
        when 37
          self.turnLeft = false
        when 39
          self.turnRight = false
        when 38, 188, 87
          self.moveDown = false
        when 40, 79, 83
          self.moveUp = false
        when 68, 69
          self.moveRight = false
        when 65
          self.moveLeft = false
  
        when 89
          self.increaseX = false
        when 70
          self.increaseY = false
        when 71
          self.increaseZ = false
        when 67
          self.increaseW = false
        when 84
          self.decreaseW = false
        when 49
          self.turnPosXW = false
        when 50
          self.turnNegXW = false

        when 51
          self.turnPosYW = false
        when 52
          self.turnNegYW = false

        when 53
          self.turnPosZW = false
        when 54
          self.turnNegZW = false
        
        when 55
          self.turnPosXY = false
        when 56
          self.turnNegXY = false
        when 57
          self.turnPosXZ = false
        when 48
          self.turnNegXZ = false
        when 219, 189
          self.turnPosYZ = false
        when 221, 187
          self.turnNegYZ = false
        

  move: ->
    
    if @increaseW
      s1.p.elements[3] += 0.01

    
    if @decreaseW
      s1.p.elements[3] -= 0.01

    if @turnPosXW
      o.applyMatrix (rotateXW Math.PI/144)
      #o.applyMatrix (rotateXW Math.PI/144)
    
    if @turnNegXW
      o.applyMatrix (rotateXW -Math.PI/144)
    
    if @turnPosYW
      o.applyMatrix (rotateYW Math.PI/144)
    
    if @turnNegYW
      o.applyMatrix (rotateYW -Math.PI/144)
    
    if @turnNegZW
      o.applyMatrix (rotateZW Math.PI/144)
    
    if @turnPosZW
      o.applyMatrix (rotateZW -Math.PI/144)

    if @turnPosXY
      o.applyMatrix (rotateXY Math.PI/144)
    if @turnNegXY
      o.applyMatrix (rotateXY -Math.PI/144)
    if @turnPosXZ
      o.applyMatrix (rotateXZ Math.PI/144)
    if @turnNegXZ
      o.applyMatrix (rotateXZ -Math.PI/144)

    if @turnPosYZ
      o.applyMatrix (rotateYZ Math.PI/144)
    if @turnNegYZ
      o.applyMatrix (rotateYZ -Math.PI/144)
    

    if @turnLeft
 #     s1.rotateXZ Math.PI/18
      cam.rotateY(-Math.PI/36)

    if @turnRight
 #     s1.rotateXZ -Math.PI/18
      cam.rotateY(Math.PI/36)

    if @moveUp
      @upVelocity = Math.max (@upVelocity - @acceleration), -@maxVelocity
    else if @moveDown
      @upVelocity = Math.min (@upVelocity + @acceleration), @maxVelocity

    if @moveRight
      @rightVelocity = Math.min (@rightVelocity + @acceleration), @maxVelocity
    else if @moveLeft
      @rightVelocity = Math.max (@rightVelocity - @acceleration), -@maxVelocity
    
    this.tryToMove @rightVelocity, @upVelocity
    cam.moveForward(@upVelocity)
    cam.moveRight(@rightVelocity)
    
    if @upVelocity > 0
      @upVelocity = Math.max (@upVelocity - @deceleration), 0
    else if @upVelocity < 0
      @upVelocity = Math.min (@upVelocity + @deceleration), 0

    if @rightVelocity > 0
      @rightVelocity = Math.max (@rightVelocity - @deceleration), 0
    else if @rightVelocity < 0
      @rightVelocity = Math.min (@rightVelocity + @deceleration), 0
  

  tryToMove: (dx, dy) ->
    @moveTo(dx, dy)

  loop: ->
    loopFn = (self) ->
      self.move()
      setTimeout loopFn, 25, self

    loopFn(this)

class Pt2D
  constructor: (@x, @y) ->



class ThreeDrawer

  @drawObject: (o) ->
    w.purge()
    o.basis.uvnMultiplyMatrix (Three.Matrix3D.scaleTransform 10, 10, 10)
    w.addObject o
    o.globalize()
    #w.generateBSPTree()
    
#    c.moveForward 43
#    c.rotateY(Math.PI)
    v.clear()
    cam.render()
