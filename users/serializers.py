from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for CustomUser model to return user details.
    """
    class Meta:
        model = CustomUser
        fields = ['id', 'email']


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},  # Ensure the password is write-only
        }

    def create(self, validated_data):
        """
        Create a new user instance with validated data.
        """
        # Using create_user ensures that the password is hashed before saving
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

      # Debugging to check if the password is coming through
def validate(self, attrs):
    email = attrs.get('email', '').strip()  # Strip any leading/trailing spaces
    password = attrs.get('password', '').strip()  # Strip any leading/trailing spaces

    print("Raw Data:", attrs)  # Debugging to check if the password is coming through

    if not email or not password:
        raise serializers.ValidationError("Email and password are required.")
    
    # Authenticate user
    user = CustomUser.objects.filter(email=email).first()
    if not user or not user.check_password(password):
        raise serializers.ValidationError("Invalid credentials or user does not exist.")

    if not user.is_active:
        raise serializers.ValidationError("This account is inactive.")

    # Return user info and tokens
    return {
        'id': user.id,
        'email': user.email,
        'tokens': {
            'refresh': str(RefreshToken.for_user(user)),
            'access': str(RefreshToken.for_user(user).access_token),
        }
    }

