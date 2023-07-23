from PIL import Image, ImageDraw
import time


def create_circle_image(rotate_degrees):
    # Set the dimensions of the image
    width, height = 32, 32

    # Create a new blank image with a transparent background
    image = Image.new("RGBA", (width, height), (0, 0, 0, 0))

    # Create a drawing context
    draw = ImageDraw.Draw(image)

    # Calculate the circle's bounding box
    circle_diameter = 20
    circle_radius = circle_diameter // 2
    circle_center = (width // 2, height // 2)

    # Divide the circle into 8 pieces and draw filled colored arcs
    for i in range(8):
        start = 45
        start_angle = start * i
        end_angle = start * (i + 1) 
        draw.pieslice([(circle_center[0] - circle_radius, circle_center[1] - circle_radius),
                       (circle_center[0] + circle_radius, circle_center[1] + circle_radius)],
                      start_angle, end_angle, fill=get_piece_color(i))

    # Rotate the image
    rotated_image = image.rotate(rotate_degrees)  # Rotate clockwise

    # Save the image
    rotated_image.save("../bonjwa/Bonjwa_rotated_rad.png")


def get_piece_color(index):
    # Define a list of colors for the pieces
    colors = [
        (255, 69, 0, 255),   # Red
        (54, 144, 234, 255),   # Blue
        (0, 163, 104, 255),   # Green
        (255, 214, 53, 255),   # Yellow
        (255, 69, 0, 255),   # Red
        (54, 144, 234, 255),   # Blue
        (0, 163, 104, 255),   # Green
        (255, 214, 53, 255),   # Yellow
    ]
    return colors[index % len(colors)]


if __name__ == "__main__":
    current_minute = int(time.strftime("%M"))
    rotate_degrees = 36 * (current_minute // 10)

    print(f"creating rad at minute {current_minute} with {rotate_degrees} rotation degrees")

    create_circle_image(rotate_degrees)

    print('done')
