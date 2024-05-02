import requests
import os
import re
import sys

def write_to_file(output, file_path):
    with open(file_path, 'a') as f:
        f.write(output + '\n')

def download_cat_images(url, download_path, num_images=50):
    if not os.path.exists(download_path):
        os.makedirs(download_path)

    response = requests.get(url)
    if response.status_code != 200:
        write_to_file("Failed to fetch the webpage", 'output.log')
        return

    img_urls = re.findall(r'(https?://[^\s]+?\.(?:jpg|png|gif))', response.text)
    cat_img_urls = [img_url for img_url in img_urls if 'cat' in img_url.lower()]

    count = 0
    for img_url in cat_img_urls:
        if count >= num_images:
            break
        try:
            image_content = requests.get(img_url).content
            with open(f"{download_path}/cat_image_{count + 1}.jpg", 'wb') as f:
                f.write(image_content)

            write_to_file(f"Downloaded image {count + 1}/{num_images}", 'output.log')
            count += 1
        except Exception as e:
            write_to_file(f"Failed to download image {count + 1}: {e}", 'output.log')

    write_to_file("Download completed.", 'output.log')

def download_cat_breed_images(download_path):
    print("Downloadind images...")
    if not os.path.exists(download_path):
        os.makedirs(download_path)

    breeds_response = requests.get('https://api.thecatapi.com/v1/breeds')
    if breeds_response.status_code != 200:
        write_to_file("Failed to fetch cat breeds", 'output.log')
        return

    breeds_data = breeds_response.json()

    for breed in breeds_data:
        breed_name = breed['name'].replace(' ', '_')
        breed_id = breed['id']

        images_response = requests.get(f'https://api.thecatapi.com/v1/images/search?breed_ids={breed_id}')
        if images_response.status_code != 200:
            write_to_file(f"Failed to fetch images for breed {breed_name}", 'output.log')
            continue

        images_data = images_response.json()
        if not images_data:
            write_to_file(f"No images found for breed {breed_name}", 'output.log')
            continue

        image_url = images_data[0]['url']
        try:
            image_content = requests.get(image_url).content
            with open(f"{download_path}/{breed_name}.jpg", 'wb') as f:
                f.write(image_content)

            write_to_file(f"Downloaded image for breed: {breed_name}", 'output.log')
        except Exception as e:
            write_to_file(f"Failed to download image for breed {breed_name}: {e}", 'output.log')

    write_to_file("Download completed.", 'output.log')

url_api = 'https://thecatapi.com/'
cat_images = 'cat_images'
download_cat_images(url_api, cat_images, num_images=50)

download_path_breeds = 'cat_breeds'
download_cat_breed_images(download_path_breeds)
