from files.__main__ import app
from files.helpers.wrappers import *
from files.helpers.alerts import *
from files.helpers.get import *
from files.helpers.const import *
from files.helpers.wrappers import *


@app.get("/casino")
@auth_required
def casino(v):
    return render_template("casino.html", v=v)
