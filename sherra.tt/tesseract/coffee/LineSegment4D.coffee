$LS4D = (e1, e2) -> new LineSegment4D e1, e2
class LineSegment4D
    constructor: (@e1, @e2) ->
        @p = @e1
        @v = @e2.subtract @e1
