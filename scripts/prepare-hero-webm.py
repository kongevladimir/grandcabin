"""Package a VP9/Opus Matroska file as WebM without changing media bytes."""
import hashlib
import json
import sys
from pathlib import Path


def vint(data, offset, identifier=False):
    first = data[offset]
    length = next(n for n in range(1, 9) if first & (1 << (8 - n)))
    value = int.from_bytes(data[offset:offset + length], 'big')
    if not identifier:
        value &= (1 << (7 * length)) - 1
    return value, offset + length


def elements(data, start, end):
    while start < end:
        tag, size_at = vint(data, start, True)
        size, payload = vint(data, size_at)
        finish = min(payload + size, end)
        yield tag, start, payload, finish
        start = finish


source = Path(sys.argv[1])
destination = Path(sys.argv[2])
data = source.read_bytes()
top = list(elements(data, 0, len(data)))
header = next(item for item in top if item[0] == 0x1A45DFA3)
doctype = next(item for item in elements(data, header[2], header[3]) if item[0] == 0x4282)
assert data[doctype[2]:doctype[3]] == b'matroska'
segment = next(item for item in top if item[0] == 0x18538067)
tracks = next(item for item in elements(data, segment[2], segment[3]) if item[0] == 0x1654AE6B)
streams = []
for tag, _, start, end in elements(data, tracks[2], tracks[3]):
    if tag != 0xAE:
        continue
    stream = {}
    for field, _, payload, finish in elements(data, start, end):
        if field == 0x86:
            stream['codec'] = data[payload:finish].decode()
        elif field == 0xE0:
            for dimension, _, a, b in elements(data, payload, finish):
                if dimension in (0xB0, 0xBA):
                    stream['width' if dimension == 0xB0 else 'height'] = int.from_bytes(data[a:b], 'big')
    assert stream.get('codec') in ('V_VP9', 'V_VP8', 'V_AV1', 'A_OPUS', 'A_VORBIS'), stream
    streams.append(stream)

# Keep the header length unchanged with an EBML Void, preserving seek offsets.
replacement = b'\x42\x82\x84webm\xec\x82\x00\x00'
assert len(replacement) == doctype[3] - doctype[1]
result = data[:doctype[1]] + replacement + data[doctype[3]:]
assert result[header[3]:] == data[header[3]:]
destination.parent.mkdir(parents=True, exist_ok=True)
destination.write_bytes(result)
print(json.dumps({'streams': streams, 'bytes': len(result), 'media_unchanged': True,
                  'media_sha256': hashlib.sha256(result[header[3]:]).hexdigest()}))
