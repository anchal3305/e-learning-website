from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer  # Import serializers
from .models import CustomUser  # Import the CustomUser model

class RegisterView(APIView):
    """
    API view to handle user registration.
    """
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    API view to handle user login.
    """
    def post(self, request):
        print("Request Data:", request.data)  # Debug: Check raw incoming data

        # Initialize the serializer with the request data
        serializer = LoginSerializer(data=request.data)

        # Check if serializer is valid
        if serializer.is_valid():
            print("Validated Data:", serializer.validated_data)  # Debug: Check validated data

            email = serializer.validated_data.get('email')
            password = serializer.validated_data.get('password')

            print(f"Email: {email}, Password: {password}")  # Debug: Ensure password is present

            user = CustomUser.objects.filter(email=email).first()
            if not user or not user.check_password(password):
                print(f"Invalid credentials for email: {email}")  # Debug line
                return Response(
                    {"error": "Invalid credentials or user does not exist."},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            if not user.is_active:
                return Response(
                    {"error": "This account is inactive."},
                    status=status.HTTP_403_FORBIDDEN
                )

            refresh = RefreshToken.for_user(user)

            return Response({
                "message": "Login successful.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }, status=status.HTTP_200_OK)

        print("Serializer Errors:", serializer.errors)  # Debug: Check serializer errors if not valid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

