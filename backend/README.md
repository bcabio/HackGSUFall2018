First install pipenv, and then run the following commands to start the server:

```console
$ pipenv install
$ FLASK_APP=backend/app.py pipenv run flask initdb
$ FLASK_APP=backend/app.py pipenv run flask run
```
