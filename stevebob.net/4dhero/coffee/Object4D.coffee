$O4D = -> new Object4D()
class Object4D
  constructor: ->
    @points = []
    @edges = []
    @faces = []

  applyMatrix: (m) ->
    for i in [0..(@points.length-1)]
      a = m.multiply @points[i]
      @points[i].elements[0] = a.elements[0]
      @points[i].elements[1] = a.elements[1]
      @points[i].elements[2] = a.elements[2]
      @points[i].elements[3] = a.elements[3]

  moveW: (x) ->
    for i in [0..(@points.length-1)]
      @points[i].elements[3] += x
      console.debug @points[i].elements[3]

Object4D.unitHyperCube = ->
  hc = $O4D()
  hc.points = [
    # front face
    ($V [1, -1, 1, 1]),  #0
    ($V [1, 1, 1, 1]),   #1
    ($V [-1, 1, 1, 1]),  #2
    ($V [-1, -1, 1, 1]), #3
    # back face
    ($V [1, -1, -1, 1]), #4
    ($V [1, 1, -1, 1]),  #5
    ($V [-1, 1, -1, 1]), #6
    ($V [-1, -1, -1, 1]),#7
    # front face 2
    ($V [1, -1, 1, -1]), #8
    ($V [1, 1, 1, -1]),  #9
    ($V [-1, 1, 1, -1]), #10
    ($V [-1, -1, 1, -1]),#11
    # back face 2
    ($V [1, -1, -1, -1]),#12
    ($V [1, 1, -1, -1]), #13
    ($V [-1, 1, -1, -1]),#14
    ($V [-1, -1, -1, -1])#15
    ]
  p = hc.points
  hc.edges = [
    # front face
    ($LS4D p[0], p[1]),
    ($LS4D p[1], p[2]),
    ($LS4D p[2], p[3]),
    ($LS4D p[3], p[0]),

    # back face
    ($LS4D p[4], p[5]),
    ($LS4D p[5], p[6]),
    ($LS4D p[6], p[7]),
    ($LS4D p[7], p[4]),

    # connections
    ($LS4D p[0], p[4]),
    ($LS4D p[1], p[5]),
    ($LS4D p[2], p[6]),
    ($LS4D p[3], p[7]),

    # front face 2
    ($LS4D p[8], p[9]),
    ($LS4D p[9], p[10]),
    ($LS4D p[10], p[11]),
    ($LS4D p[11], p[8]),

    # back face 2
    ($LS4D p[12], p[13]),
    ($LS4D p[13], p[14]),
    ($LS4D p[14], p[15]),
    ($LS4D p[15], p[12]),

    # connections 2
    ($LS4D p[8], p[12]),
    ($LS4D p[9], p[13]),
    ($LS4D p[10], p[14]),
    ($LS4D p[11], p[15]),

    # trans dimensional connections
    ($LS4D p[0], p[8]),
    ($LS4D p[1], p[9]),
    ($LS4D p[2], p[10]),
    ($LS4D p[3], p[11]),
    ($LS4D p[4], p[12]),
    ($LS4D p[5], p[13]),
    ($LS4D p[6], p[14]),
    ($LS4D p[7], p[15])]
  
  hc.faces = [
    ($P4D [p[0], p[1], p[9], p[8]]),
    ($P4D [p[1], p[2], p[10], p[9]]),
    ($P4D [p[2], p[3], p[11], p[10]]),
    ($P4D [p[3], p[0], p[8], p[11]]),
    
    ($P4D [p[4], p[5], p[13], p[12]]),
    ($P4D [p[5], p[6], p[14], p[13]]),
    ($P4D [p[6], p[7], p[15], p[14]]),
    ($P4D [p[7], p[4], p[12], p[15]]),
    
    ($P4D [p[0], p[4], p[12], p[8]]),
    ($P4D [p[1], p[5], p[13], p[9]]),
    ($P4D [p[2], p[6], p[14], p[10]]),
    ($P4D [p[3], p[7], p[15], p[11]]),

    ($P4D [p[0], p[1], p[2], p[3]]),
    ($P4D [p[4], p[5], p[6], p[7]]),
    ($P4D [p[0], p[1], p[5], p[4]]),
    ($P4D [p[2], p[3], p[7], p[6]]),
    ($P4D [p[1], p[2], p[6], p[5]]),
    ($P4D [p[0], p[3], p[7], p[4]]),

    ($P4D [p[8], p[9], p[10], p[11]]),
    ($P4D [p[12], p[13], p[14], p[15]]),
    ($P4D [p[8], p[9], p[13], p[12]]),
    ($P4D [p[10], p[11], p[15], p[14]]),
    ($P4D [p[9], p[10], p[14], p[13]]),
    ($P4D [p[8], p[11], p[15], p[12]]),
    ]

  return hc

Object4D.taperedHyperCube = (start, end) ->
  hc = $O4D()
  hc.points = [
    # front face
    ($V [start, -start, start, 1]),  #0
    ($V [start, start, start, 1]),   #1
    ($V [-start, start, start, 1]),  #2
    ($V [-start, -start, start, 1]), #3
    # back face
    ($V [start, -start, -start, 1]), #4
    ($V [start, start, -start, 1]),  #5
    ($V [-start, start, -start, 1]), #6
    ($V [-start, -start, -start, 1]),#7
    # front face 2
    ($V [end, -end, end, -1]), #8
    ($V [end, end, end, -1]),  #9
    ($V [-end, end, end, -1]), #10
    ($V [-end, -end, end, -1]),#11
    # back face 2
    ($V [end, -end, -end, -1]),#12
    ($V [end, end, -end, -1]), #13
    ($V [-end, end, -end, -1]),#14
    ($V [-end, -end, -end, -1])#15
    ]
  p = hc.points
  hc.edges = [
    # front face
    ($LS4D p[0], p[1]),
    ($LS4D p[1], p[2]),
    ($LS4D p[2], p[3]),
    ($LS4D p[3], p[0]),

    # back face
    ($LS4D p[4], p[5]),
    ($LS4D p[5], p[6]),
    ($LS4D p[6], p[7]),
    ($LS4D p[7], p[4]),

    # connections
    ($LS4D p[0], p[4]),
    ($LS4D p[1], p[5]),
    ($LS4D p[2], p[6]),
    ($LS4D p[3], p[7]),

    # front face 2
    ($LS4D p[8], p[9]),
    ($LS4D p[9], p[10]),
    ($LS4D p[10], p[11]),
    ($LS4D p[11], p[8]),

    # back face 2
    ($LS4D p[12], p[13]),
    ($LS4D p[13], p[14]),
    ($LS4D p[14], p[15]),
    ($LS4D p[15], p[12]),

    # connections 2
    ($LS4D p[8], p[12]),
    ($LS4D p[9], p[13]),
    ($LS4D p[10], p[14]),
    ($LS4D p[11], p[15]),

    # trans dimensional connections
    ($LS4D p[0], p[8]),
    ($LS4D p[1], p[9]),
    ($LS4D p[2], p[10]),
    ($LS4D p[3], p[11]),
    ($LS4D p[4], p[12]),
    ($LS4D p[5], p[13]),
    ($LS4D p[6], p[14]),
    ($LS4D p[7], p[15])]
  
  hc.faces = [
    ($P4D [p[0], p[1], p[9], p[8]]),
    ($P4D [p[1], p[2], p[10], p[9]]),
    ($P4D [p[2], p[3], p[11], p[10]]),
    ($P4D [p[3], p[0], p[8], p[11]]),
    
    ($P4D [p[4], p[5], p[13], p[12]]),
    ($P4D [p[5], p[6], p[14], p[13]]),
    ($P4D [p[6], p[7], p[15], p[14]]),
    ($P4D [p[7], p[4], p[12], p[15]]),
    
    ($P4D [p[0], p[4], p[12], p[8]]),
    ($P4D [p[1], p[5], p[13], p[9]]),
    ($P4D [p[2], p[6], p[14], p[10]]),
    ($P4D [p[3], p[7], p[15], p[11]]),

    ($P4D [p[0], p[1], p[2], p[3]]),
    ($P4D [p[4], p[5], p[6], p[7]]),
    ($P4D [p[0], p[1], p[5], p[4]]),
    ($P4D [p[2], p[3], p[7], p[6]]),
    ($P4D [p[1], p[2], p[6], p[5]]),
    ($P4D [p[0], p[3], p[7], p[4]]),

    ($P4D [p[8], p[9], p[10], p[11]]),
    ($P4D [p[12], p[13], p[14], p[15]]),
    ($P4D [p[8], p[9], p[13], p[12]]),
    ($P4D [p[10], p[11], p[15], p[14]]),
    ($P4D [p[9], p[10], p[14], p[13]]),
    ($P4D [p[8], p[11], p[15], p[12]]),
    ]
  return hc

