db.getCollection("files").find(
{ UserId: "5d2f818f81808747b77a8d17" }, 
{ Files: { $all: [ "/music" ] } })
