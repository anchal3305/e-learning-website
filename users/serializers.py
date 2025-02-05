from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_email(self, value):
        """
        Check if the email already exists in the database.
        """
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        """
        Create and return a new user instance.
        """
        return CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        """
        Validate login credentials and check if the user exists and is active.
        """
        email = attrs.get('email', '').strip()
        password = attrs.get('password', '').strip()

        user = CustomUser.objects.filter(email=email).first()
        if not user or not user.check_password(password):
            raise serializers.ValidationError("Invalid credentials or user does not exist.")

        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")

        attrs['user'] = user
        return attrs

    def get_tokens(self, user):
        """
        Generate and return JWT tokens for the authenticated user.
        """
        refresh = RefreshToken.for_user(user)
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }

class UserDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for returning user details like email and ID.
    """
    class Meta:
        model = CustomUser
        fields = ['id', 'email']
