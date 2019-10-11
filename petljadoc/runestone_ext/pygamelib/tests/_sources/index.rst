
.. activecode:: test1
    :nocodelens:
   
    #test
    import pygame as pg

    window_width, window_height = 400, 300

    vx, vy = 40, 20 

    side = 50

    color = pg.Color('yellow')

    background_color = pg.Color('black')

    pg.init()

    window = pg.display.set_mode([window_width, window_height])

    while not pg.event.get(pg.QUIT):

        t = 1.0 * pg.time.get_ticks() / 1000 

        x = (t * vx) % (window_width - side)

        y = (t * vy) % (window_height - side)

        window.fill(background_color)

        pg.draw.rect(window, color, pg.Rect(x, y, side, side))

        pg.display.update()

        pg.time.wait(10)
