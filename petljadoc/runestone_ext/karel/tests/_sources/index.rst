.. karel:: Karel

   {
        setup:function() {
            var world = new World(5,5);
            world.setRobotStartAvenue(1);
            world.setRobotStartStreet(1);
            world.setRobotStartDirection("E");
            world.putBall(3, 3);
            world.addEWWall(1, 1, 2);
            world.addNSWall(2, 2, 2);
            world.addEWWall(2, 3, 3);
            world.addNSWall(3, 1, 2);
            world.addNSWall(3, 4, 1);
            world.addNSWall(1, 5, 1);
            world.addEWWall(4, 1, 1);
            
	    var robot = new Robot();

	    var code = ["from karel import *",
					"move()      #move forward",
					"move()      #move forward",
					"turnLeft()  #turn left",
					"move()      #turn left",
					"move()      #move forward",
					"pickBall()  #pick up the ball"];
            return {robot:robot, world:world, code:code};
        },
	
        isSuccess: function(robot, world) {
           return robot.getStreet() === 3 &&
           robot.getAvenue() === 3 &&
	   robot.getBalls() === 1;
        },
   }



.. karel:: Karel_2

   {
        setup:function() {
            var world = new World(5,5);
            world.setRobotStartAvenue(1);
            world.setRobotStartStreet(1);
            world.setRobotStartDirection("E");
            world.putBall(3, 3);
            world.addEWWall(1, 1, 2);
            world.addNSWall(2, 2, 2);
            world.addEWWall(2, 3, 3);
            world.addNSWall(3, 1, 2);
            world.addNSWall(3, 4, 1);
            world.addNSWall(1, 5, 1);
            world.addEWWall(4, 1, 1);
            
	    var robot = new Robot();

	    var code = ["from karel import *",
					"move()      #move forward",
					"move()      #move forward",
					"move()      #move forward",
					"move()      #move forward"];
            return {robot:robot, world:world, code:code};
        },
	
        isSuccess: function(robot, world) {
           return robot.getStreet() === 3 &&
           robot.getAvenue() === 3 &&
	   robot.getBalls() === 1;
        },
   }




.. karel:: Karel_3

   {
        setup:function() {
            var world = new World(5,5);
            world.setRobotStartAvenue(1);
            world.setRobotStartStreet(1);
            world.setRobotStartDirection("E");
            world.putBall(3, 3);
            world.addEWWall(1, 1, 2);
            world.addNSWall(2, 2, 2);
            world.addEWWall(2, 3, 3);
            world.addNSWall(3, 1, 2);
            world.addNSWall(3, 4, 1);
            world.addNSWall(1, 5, 1);
            world.addEWWall(4, 1, 1);
            
	    var robot = new Robot();

	    var code = ["from karel import *",
					"move()      #move forward",
					"move()      #move forward",
					"move()      #move forward",
					"move())     #move forward"];
            return {robot:robot, world:world, code:code};
        },
	
        isSuccess: function(robot, world) {
           return robot.getStreet() === 3 &&
           robot.getAvenue() === 3 &&
	   robot.getBalls() === 1;
        },
   }



