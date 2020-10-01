den = 32
answer = ""
hexadecimalcharvalues = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
]
hexadecimalchars = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
]
stop = False
if den < 16:
    for i in range(len(hexadecimalcharvalues)):
        if hexadecimalcharvalues[i] == den:
            answer = hexadecimalchars[i]
            stop = True


while stop == False:
    integer = den // 16
    afterdot = den % 16
    if integer < 16:
        if afterdot == 0:
            answer += "0"
        else:
            for i in range(len(hexadecimalcharvalues)):
                if hexadecimalcharvalues[i] == (afterdot):
                    answer += hexadecimalchars[i]
        for i in range(len(hexadecimalcharvalues)):
            if hexadecimalcharvalues[i] == integer:
                answer += hexadecimalchars[i]
        stop = True
    else:
        for i in range(len(hexadecimalcharvalues)):
            if hexadecimalcharvalues[i] == (afterdot):
                answer += hexadecimalchars[i]
        den = integer
answer = answer[::-1]

print(answer)
