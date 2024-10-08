import os
from PIL import Image

def create_image_grid(input_folder, output_file, images_per_row, final_size=(1000, 1000), quality=85):
    # List all JPG files in the folder
    image_files = [f for f in os.listdir(input_folder) if f.endswith('.jpg')]
    
    # Open all images to determine the smallest size
    images = [Image.open(os.path.join(input_folder, f)) for f in image_files]
    min_width = min(img.size[0] for img in images)
    min_height = min(img.size[1] for img in images)
    
    # Crop images to the center part of the smallest size
    cropped_images = []
    for img in images:
        width, height = img.size
        left = (width - min_width) // 2
        top = (height - min_height) // 2
        right = left + min_width
        bottom = top + min_height
        cropped_img = img.crop((left, top, right, bottom))
        cropped_images.append(cropped_img)
    
    # Create a blank canvas for the grid collage
    grid_width = min_width * images_per_row
    grid_height = min_height * images_per_row
    grid_image = Image.new('RGB', (grid_width, grid_height))

    # Place each image in the grid
    for index, img in enumerate(cropped_images):
        row = index // images_per_row
        col = index % images_per_row
        x = col * min_width
        y = row * min_height
        grid_image.paste(img, (x, y))
    
    # Resize the final image to the specified final size
    grid_image_resized = grid_image.resize(final_size, Image.LANCZOS)
    
    # Save the final image with reduced quality
    grid_image_resized.save(output_file, format='JPEG', quality=quality)
    print(f"Collage saved as {output_file}, dimensions: {final_size}, quality: {quality}")


# Example usage
input_folder = './album_covers'
output_file = 'collage.jpg'
images_per_row = 22  # Set this to the square root of the number of images
final_size = (1000, 1000)  # Set the desired output size (width, height)
quality = 100
create_image_grid(input_folder, output_file, images_per_row, final_size, quality)
