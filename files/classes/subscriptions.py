from sqlalchemy import *
from sqlalchemy.orm import relationship
from files.__main__ import Base


class Subscription(Base):
	__tablename__ = "subscriptions"
	user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
	submission_id = Column(Integer, ForeignKey("submissions.id"), primary_key=True)
	
	user = relationship("User", uselist=False, viewonly=True)

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)

	def __repr__(self):
		return f"<Subscription(id={self.id})>"


class Follow(Base):
	__tablename__ = "follows"
	id = Column(Integer, primary_key=True)
	user_id = Column(Integer, ForeignKey("users.id"))
	target_id = Column(Integer, ForeignKey("users.id"))
	created_utc = Column(Integer)

	user = relationship("User", uselist=False, primaryjoin="User.id==Follow.user_id", viewonly=True)
	target = relationship("User", primaryjoin="User.id==Follow.target_id", viewonly=True)

	def __init__(self, *args, **kwargs):
		if "created_utc" not in kwargs: kwargs["created_utc"] = int(time.time())
		super().__init__(*args, **kwargs)

	def __repr__(self):
		return f"<Follow(id={self.id})>"