from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser
from django.contrib.auth import get_user_model
from .serializers import LoginSerializer, RegisterSerializer, UserDetailSerializer
from datetime import timedelta
import logging

# Configure logging for debugging purposes
logger = logging.getLogger(__name__)

# Helper function to generate tokens with extended expiration time
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    # Set the expiration time for the access token (e.g., 24 hours)
    access_token = refresh.access_token
    access_token.set_exp(lifetime=timedelta(hours=24))  # Access token expires in 24 hours
    return {
        'access': str(access_token),
        'refresh': str(refresh)
    }

class RegisterView(generics.CreateAPIView):
    permission_classes = []  # No authentication required for signup
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        # Authenticate the user
        user = get_user_model().objects.filter(email=email).first()

        if user and user.check_password(password):
            # Generate tokens
            tokens = get_tokens_for_user(user)
            decoded_access = AccessToken(tokens['access'])
            exp_time = decoded_access["exp"]

            # Return tokens and user info
            return Response({
                "user": {"id": user.id, "email": user.email},
                "access": tokens['access'],
                "refresh": tokens['refresh'],
                "expires_at": exp_time,  # Send expiration time as well
            })

        # Log failed login attempt
        logger.warning(f"Failed login attempt for email: {email}")
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class TokenRefreshView(APIView):
    def post(self, request):
        refresh_token = request.data.get("refresh")
        try:
            # Validate the refresh token and generate a new access token
            refresh = RefreshToken(refresh_token)
            new_access_token = str(refresh.access_token)
            return Response({"access": new_access_token})
        except Exception as e:
            return Response({"detail": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)
        
class ProtectedResourceView(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users can access this view
    queryset = CustomUser.objects.all()
    serializer_class = UserDetailSerializer  # Use the new serializer

    def get(self, request, *args, **kwargs):
        # Return the details of the authenticated user
        user = request.user  # Get the currently authenticated user
        serializer = self.serializer_class(user)
        return Response(serializer.data)
