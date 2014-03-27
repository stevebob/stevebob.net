
project = (a, b) ->
  len = b.modulus()
  return b.multiply(a.dot(b)/(len*len))

len = (v) ->
  x = v.elements[0]
  y = v.elements[1]
  dist = Math.sqrt(x*x+y*y)

class Hero4D
  constructor: (@boundary, @count, @maxHeros, @maxVillains) ->
    b = @boundary
    @vectors = [0..@count-1].map (i) ->
      $V ([0..3].map (j) ->
        Math.random() * b * 2 - b
      )
    
    maxv = @maxVillains
    maxh = @maxHeros
    c = @count
    @heros = [0..@count-1].map (i) ->
      h = i
      while h == i
        h = Math.floor(Math.random() * maxh)
      return h

    @villains = [0..@count-1].map (i) ->
      v = i
      while v == i
        v = c - 1 - Math.floor(Math.random() * maxv)
      return v
  

  progress: () ->
    h = @heros
    v = @villains
    p = @vectors
    next = [0..@vectors.length-1].map (i) ->
      hi = p[h[i]] # the hero of vector i
      vi = p[v[i]] # the villain of vector i
      pi = p[i]

      # find the closest point to pi on the line between hi and vi
      closest = project((pi.subtract vi), hi.subtract vi).add(vi)

      firstNonZero = 0
      idxNonZero = 0
      j = 0
      while firstNonZero == 0 && j < vi.elements.length
        firstNonZero = vi.elements[j]
        idxNonZero = j
        j++

      if firstNonZero == 0
        return pi

      x = (closest.elements[idxNonZero] - vi.elements[idxNonZero]) / (hi.elements[idxNonZero] - vi.elements[idxNonZero])
      destination = closest
      if x < 1
        destination = hi
      
      if (destination.distanceFrom pi) < 0.1
        return pi # don't move - it's close enough
      
      # now find a point towards the destination
      towards = (destination.subtract pi).toUnitVector().multiply(0.1).add pi
      return towards
    
    for i in [0..@vectors.length-1]
      @vectors[i] = next[i]


      

  toObject: () ->
    o = new Object4D
    o.points = @vectors
    return o
