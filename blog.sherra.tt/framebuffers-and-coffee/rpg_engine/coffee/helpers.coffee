zip = (xs, ys) ->
  return [] if not (xs.length and ys.length)
  rest = zip xs[1..], ys[1..]
  rest.unshift {_1: xs[0], _2: ys[0]}
  return rest

zipWith = (xs, ys, fn) ->
  (zip xs, ys).map (x) ->
    fn x._1, x._2
