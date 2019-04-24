import datetime


def to_iso_format(time: datetime.datetime) -> str:
    return time.replace(tzinfo=datetime.timezone.utc).isoformat().replace('+00:00', 'Z')
