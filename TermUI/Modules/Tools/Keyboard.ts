// Keyboard
module Keyboard {
  // keys
  export enum Keys {
    a = '61',
    b = '62',
    c = '63',
    d = '64',
    e = '65',
    f = '66',
    g = '67',
    h = '68',
    i = '69',
    j = '6a',
    k = '6b',
    l = '6c',
    m = '6d',
    n = '6e',
    o = '6f',
    p = '70',
    q = '71',
    r = '72',
    s = '73',
    t = '74',
    u = '75',
    v = '76',
    w = '77',
    x = '78',
    y = '79',
    z = '7a',

    A = '41',
    B = '42',
    C = '43',
    D = '44',
    E = '45',
    F = '46',
    G = '47',
    H = '48',
    I = '49',
    J = '4a',
    K = '4b',
    L = '4c',
    M = '4d',
    N = '4e',
    O = '4f',
    P = '50',
    Q = '51',
    R = '52',
    S = '53',
    T = '54',
    U = '55',
    V = '56',
    W = '57',
    X = '58',
    Y = '59',
    Z = '5a',

    CtrlA = '01',
    CtrlB = '02',
    CtrlC = '03',
    CtrlD = '04',
    CtrlE = '05',
    CtrlF = '06',
    CtrlG = '07',
    CtrlH = '08',
    CtrlJ = '0a',
    CtrlK = '0b',
    CtrlL = '0c',
    CtrlN = '0e',
    CtrlO = '0f',
    CtrlP = '10',
    CtrlQ = '11',
    CtrlR = '12',
    CtrlS = '13',
    CtrlT = '14',
    CtrlU = '15',
    CtrlV = '16',
    CtrlW = '17',
    CtrlX = '18',
    CtrlY = '19',

    Backtick = '60',
    Tilde = '7e',
    Zero = '30',
    CloseParenthesis = '29',
    One = '31',
    ExclamationMark = '21',
    Two = '32',
    AtSign = '40',
    Three = '33',
    Hash = '23',
    Four = '34',
    DollarSign = '24',
    Five = '35',
    PercentSign = '25',
    Six = '36',
    Caret = '5e',
    Seven = '37',
    Ampersand = '26',
    Eight = '38',
    Asterisk = '2a',
    Nine = '39',
    OpenParenthesis = '28',
    Hyphen = '2d',
    Underscore = '5f',
    EqualsSign = '3d',
    PlusSign = '2b',

    OpenBracket = '5b',
    CloseBracket = '5d',
    OpenBraces = '7b',
    CloseBraces = '7d',
    Backslash = '5c',
    VerticalBar = '7c',
    SemiColon = '3b',
    Colon = '3a',
    ApostropheMark = '27',
    QuotationMark = '22',
    Comma = '2c',
    LessThan = '3c',
    Period = '2e',
    MoreThan = '3e',
    Slash = '2f',
    QuestionMark = '3f',

    Space = '20',
    Enter = '0d',
    Delete = '7f',
    Tab = '09',
    Esc = '1b',
    ArrowLeft = '1b5b44',
    ArrowRight = '1b5b43',
    ArrowUp = '1b5b41',
    ArrowDown = '1b5b42',

    F1 = '1b4f50',
    F2 = '1b4f51',
    F3 = '1b4f52',
    F4 = '1b4f53',
    F5 = '1b5b31357e',
    F6 = '1b5b31377e',
    F7 = '1b5b31387e',
    F8 = '1b5b31397e',
    F9 = '1b5b32307e',
    F10 = '1b5b32317e',
    F11 = '1b5b32337e',
    F12 = '1b5b32347e',

    NumpadHome = '1b5b48',
    NumpadDelete = '1b5b337e',
    NumpadEnd = '1b5b46',

    PageUp = '1b5b357e',
    PageDown = '1b5b367e',

    None = ''
  }

  // Alphabets
  export const Alphabets = [
    Keyboard.Keys.a, Keyboard.Keys.b, Keyboard.Keys.c, Keyboard.Keys.d, Keyboard.Keys.e, Keyboard.Keys.f, Keyboard.Keys.g, Keyboard.Keys.h, Keyboard.Keys.i, Keyboard.Keys.j, Keyboard.Keys.k, Keyboard.Keys.l, Keyboard.Keys.m, Keyboard.Keys.n, Keyboard.Keys.o, Keyboard.Keys.p, Keyboard.Keys.q, Keyboard.Keys.r, Keyboard.Keys.s, Keyboard.Keys.t, Keyboard.Keys.u, Keyboard.Keys.v, Keyboard.Keys.w, Keyboard.Keys.x, Keyboard.Keys.y, Keyboard.Keys.z,
    Keyboard.Keys.A, Keyboard.Keys.B, Keyboard.Keys.C, Keyboard.Keys.D, Keyboard.Keys.E, Keyboard.Keys.F, Keyboard.Keys.G, Keyboard.Keys.H, Keyboard.Keys.I, Keyboard.Keys.J, Keyboard.Keys.K, Keyboard.Keys.L, Keyboard.Keys.M, Keyboard.Keys.N, Keyboard.Keys.O, Keyboard.Keys.P, Keyboard.Keys.Q, Keyboard.Keys.R, Keyboard.Keys.S, Keyboard.Keys.T, Keyboard.Keys.U, Keyboard.Keys.V, Keyboard.Keys.W, Keyboard.Keys.X, Keyboard.Keys.Y, Keyboard.Keys.Z
  ]

  // Numbers
  export const Numbers = [
    Keyboard.Keys.Zero, Keyboard.Keys.One, Keyboard.Keys.Two, Keyboard.Keys.Three, Keyboard.Keys.Four, Keyboard.Keys.Five, Keyboard.Keys.Six, Keyboard.Keys.Seven, Keyboard.Keys.Eight, Keyboard.Keys.Nine
  ]

  // Symbols
  export const Symbols = [
    Keyboard.Keys.Backtick, Keyboard.Keys.Tilde, Keyboard.Keys.CloseParenthesis, Keyboard.Keys.ExclamationMark, Keyboard.Keys.AtSign, Keyboard.Keys.Hash, Keyboard.Keys.DollarSign, Keyboard.Keys.PercentSign, Keyboard.Keys.Caret, Keyboard.Keys.Ampersand, Keyboard.Keys.Asterisk, Keyboard.Keys.OpenParenthesis, Keyboard.Keys.Hyphen, Keyboard.Keys.Underscore, Keyboard.Keys.EqualsSign, Keyboard.Keys.PlusSign,
    Keyboard.Keys.OpenBracket, Keyboard.Keys.CloseBracket, Keyboard.Keys.OpenBraces, Keyboard.Keys.CloseBraces, Keyboard.Keys.Backslash, Keyboard.Keys.VerticalBar, Keyboard.Keys.SemiColon, Keyboard.Keys.Colon, Keyboard.Keys.ApostropheMark, Keyboard.Keys.QuotationMark, Keyboard.Keys.Comma, Keyboard.Keys.LessThan, Keyboard.Keys.Period, Keyboard.Keys.MoreThan, Keyboard.Keys.Slash, Keyboard.Keys.QuestionMark,
  ]
}

export default Keyboard
