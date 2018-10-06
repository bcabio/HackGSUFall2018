from attr.exceptions import NotAnAttrsClassError
from datetime import datetime

import attr
from flask.json import JSONEncoder


class MyJSONEncoder(JSONEncoder):
    def default(self, obj):
        try:
            return attr.asdict(obj)
        except NotAnAttrsClassError:
            if isinstance(obj, datetime):
                return obj.isoformat()
            return super(MyJSONEncoder, self).default(obj)
