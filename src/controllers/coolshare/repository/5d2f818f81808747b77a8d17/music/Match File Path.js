db.getCollection("files").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: {
				UserId: "5d2f818f81808747b77a8d17"
			}
		},

		// Stage 2
		{
			$unwind: "$Files"
		},

		// Stage 3
		{
			$match: {
				"Files.Path": { $regex: "/my-music-3" }
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
