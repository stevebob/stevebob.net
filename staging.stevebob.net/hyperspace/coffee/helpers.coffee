zip = (xs, ys) ->
  return [] if not (xs.length and ys.length)
  rest = zip xs[1..], ys[1..]
  rest.unshift {_1: xs[0], _2: ys[0]}
  return rest

zipWith = (xs, ys, fn) ->
  (zip xs, ys).map (x) ->
    fn x._1, x._2

allZeros = (arr) ->
  if arr.length == 0
    return true
  else
    if arr[0] == 0
      return allZeros arr[1..]
    else
      return false



rotateXY= (theta) ->
  return $M [
    [(Math.cos theta), (Math.sin theta), 0, 0],
    [-(Math.sin theta), (Math.cos theta), 0, 0],
    [0,                 0,                1, 0],
    [0,                 0,                0, 1]
  ]
  

rotateXW= (theta) ->
  return $M [
    [(Math.cos theta), 0, 0, (Math.sin theta)],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [-(Math.sin theta), 0, 0, (Math.cos theta)]]

rotateYW= (theta) ->
  return $M [
    [1, 0, 0, 0],
    [0, (Math.cos theta), 0, -(Math.sin theta)],
    [0, 0, 1, 0],
    [0, (Math.sin theta), 0, (Math.cos theta)]]
  
rotateZW= (theta) ->
  return $M [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, (Math.cos theta), -(Math.sin theta)],
    [0, 0, (Math.sin theta), (Math.cos theta)]]

rotateYZ= (theta) ->
  return $M [
    [1, 0, 0, 0],
    [0, (Math.cos theta), (Math.sin theta), 0],
    [0, -(Math.sin theta), (Math.cos theta), 0],
    [0, 0, 0, 1]]

rotateXZ= (theta) ->
  return $M [
    [(Math.cos theta), 0, -(Math.sin theta), 0],
    [0, 1, 0, 0],
    [(Math.sin theta), 0, (Math.cos theta), 0],
    [0, 0, 0, 1]]

