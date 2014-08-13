$S4D = (a, b, c, d) -> new Space4D a, b, c, d
class Space4D
  constructor: (@p, @v1, @v2, @v3) ->
  
  containsPoint: (p) ->
    mat3 = ($M [@v1.elements[0..2], @v2.elements[0..2], @v3.elements[0..2]]).transpose()
    rhs = p.subtract @p
    # before inverting the matrix, check if a row is all zeros
    i = 0
    idxs = null
    for row in mat3.elements
      if allZeros row
        # first check if the corresponding value is zero
        if rhs.elements[i] != 0
          return null
        if i == 0
          idxs = [1..3]
        else
          idxs = [0..i-1].concat [i+1..3]
        
        vs = [@v1, @v2, @v3]
        mat3 = []
        for v in vs
          r = []
          for j in idxs
            r[r.length] = v.elements[j]

          mat3[mat3.length] = r
        mat3 = $M mat3
        mat3 = mat3.transpose()
        break

      ++i
    
    # now we can safely inverse the matrix
    invMat3 = mat3.inverse()

    # if this turned out to be null, the space is not made up of 
    # 3 linearly independant vertices
    if invMat3 == null
      return null
    
    # at this point, if one of the rows was replaced earlier, we
    # already know if the point lies on in the space
    if i <3
      rhsPart = []
      for j in idxs
        rhsPart[rhsPart.length] = rhs.elements[j]

      rhsPart = $V rhsPart
      sol = invMat3.multiply (rhsPart)
      return sol
    
    
    sol = invMat3.multiply ($V rhs.elements[0..2])
    if @v1.elements[3] * sol.elements[0] + @v2.elements[3] * sol.elements[1] + @v3.elements[3] * sol.elements[2] == rhs.elements[3]
      return sol
    else
      return null

  containsLineSegment: (l) ->
    e1sol = this.containsPoint l.e1
    if e1sol == null
      return null
    e2sol = this.containsPoint l.e2
    if e2sol == null
      return null
    return $LS4D e1sol, e2sol

  intersectWithLineSegment: (l) ->
    seg = this.containsLineSegment l
    if seg == null
      # the line does not lie in the space, but it may intersect it
      mat4 = ($M [@v1.elements, @v2.elements, @v3.elements, l.v.multiply(-1).elements]).transpose()
      rhs = l.p.subtract @p
      # if the matrix is not invertible, either the space is not
      # made up of 3 linearly independant vectors, or the line is
      # parallel to the space and doesn't lie in it
      invMat4 = mat4.inverse()
      if invMat4 == null
        return null
       
      sol = invMat4.multiply rhs
      if sol.elements[3] >= 0 and sol.elements[3] <= 1

        return $V sol.elements[0..2]
      else
        return null
    else
      return seg
  
  intersectWithPolygon: (pol) ->
    p1sol = this.containsPoint pol.points[0]
    p2sol = this.containsPoint pol.points[1]
    p3sol = this.containsPoint pol.points[2]
    
    ends = []
    if p1sol == null or p2sol == null or p3sol == null
      for i in [0..pol.points.length-1]
        current = pol.points[i]
        next = null
        if i == pol.points.length - 1
          next = pol.points[0]
        else
          next = pol.points[i+1]

        line = $LS4D current, next
        ict = this.intersectWithLineSegment line
        if ict != null
          ends[ends.length] = ict
      console.debug ends.length
      if ends.length == 2
        return [($LS4D ends[0], ends[1])]
      else if ends.length == 4
        return [($LS4D ends[0], ends[1]), ($LS4D ends[1], ends[2]), ($LS4D ends[2], ends[3]), ($LS4D ends[3], ends[0])]# ($LS4D ends[0], ends[2]), ($LS4D ends[1], ends[3])]

    return null

  rotateXY: (theta) ->
    mat = $M [
      [(Math.cos theta), (Math.sin theta), 0, 0],
      [-(Math.sin theta), (Math.cos theta), 0, 0],
      [0,                 0,                1, 0],
      [0,                 0,                0, 1]
    ]
    
    @v1 = mat.multiply @v1
    @v2 = mat.multiply @v2
    @v3 = mat.multiply @v3


  rotateXW: (theta) ->
    mat = $M [
      [(Math.cos theta), 0, 0, (Math.sin theta)],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [-(Math.sin theta), 0, 0, (Math.cos theta)]]

    @v1 = mat.multiply @v1
    @v2 = mat.multiply @v2
    @v3 = mat.multiply @v3

  rotateYW: (theta) ->
    mat = $M [
      [1, 0, 0, 0],
      [0, (Math.cos theta), 0, -(Math.sin theta)],
      [0, 0, 1, 0],
      [0, (Math.sin theta), 0, (Math.cos theta)]]
    
    @v1 = mat.multiply @v1
    @v2 = mat.multiply @v2
    @v3 = mat.multiply @v3

  rotateZW: (theta) ->
    mat = $M [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, (Math.cos theta), -(Math.sin theta)],
      [0, 0, (Math.sin theta), (Math.cos theta)]]

    @v1 = mat.multiply @v1
    @v2 = mat.multiply @v2
    @v3 = mat.multiply @v3
  
  rotateYZ: (theta) ->
    mat = $M [
      [1, 0, 0, 0],
      [0, (Math.cos theta), (Math.sin theta), 0],
      [0, -(Math.sin theta), (Math.cos theta), 0],
      [0, 0, 0, 1]]
    @v1 = mat.multiply @v1
    @v2 = mat.multiply @v2
    @v3 = mat.multiply @v3

  rotateXZ: (theta) ->
    mat = $M [
      [(Math.cos theta), 0, -(Math.sin theta), 0],
      [0, 1, 0, 0],
      [(Math.sin theta), 0, (Math.cos theta), 0],
      [0, 0, 0, 1]]
    @v1 = mat.multiply @v1
    @v2 = mat.multiply @v2
    @v3 = mat.multiply @v3

