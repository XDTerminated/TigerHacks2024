from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv
import os
import base64
import google.generativeai as genai
import PIL.Image
import io
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import UserNutritionData
from .serializers import UserNutritionDataSerializer

load_dotenv()


@csrf_exempt
def NutritionFacts(request):
    if request.method == "OPTIONS":
        response = JsonResponse({})
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    if request.method == "POST":
        try:
            # Configure Gemini
            genai.configure(api_key=os.getenv("API_KEY"))

            # Get image from request
            image_file = request.FILES.get("image")
            if not image_file:
                return JsonResponse({"error": "No image provided"}, status=400)

            # Convert to PIL Image
            image_bytes = image_file.read()
            image = PIL.Image.open(io.BytesIO(image_bytes))

            # Initialize Gemini model
            model = genai.GenerativeModel("gemini-1.5-flash")

            # First question - ingredients
            ingredients_response = model.generate_content(
                [
                    image,
                    "\n\n",
                    """List ONLY the ingredients and their quantities for the food in this image.
                    Format: Return each ingredient with its amount on a new line.
                    Example format:
                    2 cups flour
                    1 tsp salt
                    3 tbsp sugar
                    
                    Do not include any other text or descriptions.""",
                ],
                generation_config=genai.types.GenerationConfig(
                    temperature=0.0,
                ),
            )

            print(ingredients_response.text)

            # Second question - nutrition info
            nutrition_response = model.generate_content(
                [
                    image,
                    "\n\n",
                    f"""Please analyze this food and provide ONLY the following estimated nutritional values as numbers (no units or text):
                1. Total Calories (kcal)
                2. Total Fat (g)
                3. Cholesterol (mg)
                4. Sodium (mg)
                5. Total Carbohydrates (g)
                6. Protein (g)

                Ensure that the numbers are relatively consistent with the amount of food in the image, and make your best inference if the image is unclear.
                
                Format: Return only 6 numbers separated by commas, in the exact order above.""",
                ],
                generation_config=genai.types.GenerationConfig(
                    temperature=0.0,
                ),
            )

            print(nutrition_response.text)

            # Parse the response into array of integers
            try:
                # Split by comma and convert to integers
                nutrition_values = [
                    int(float(x.strip()))
                    for x in nutrition_response.text.replace("\n", "").split(",")
                ]

                print(nutrition_values)

                # Ensure we have exactly 6 values
                if len(nutrition_values) != 6:
                    raise ValueError("Invalid number of nutrition values returned")

                return JsonResponse(
                    {
                        "ingredients": ingredients_response.text,
                        "nutrition": nutrition_values,
                    }
                )

            except Exception as e:
                print(f"Error parsing nutrition values: {str(e)}")
                return JsonResponse(
                    {"error": "Failed to parse nutrition values"}, status=500
                )

        except Exception as e:
            print(f"Error processing request: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def user_nutrition_data(request):
    try:
        nutrition_data = UserNutritionData.objects.get(user=request.user)
    except UserNutritionData.DoesNotExist:
        nutrition_data = UserNutritionData(user=request.user)

    if request.method == "GET":
        serializer = UserNutritionDataSerializer(nutrition_data)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = UserNutritionDataSerializer(nutrition_data, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
