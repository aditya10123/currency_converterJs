from django.contrib.auth.hashers import make_password


raw_pass = "aadd1122"


hash = make_password(raw_pass)


print(hash)