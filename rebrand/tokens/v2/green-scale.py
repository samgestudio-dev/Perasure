import math
def s2l(c): c/=255; return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def l2s(c): c=max(0,min(1,c)); return round(255*(12.92*c if c<=0.0031308 else 1.055*c**(1/2.4)-0.055))
def hex2oklch(h):
    r,g,b=[s2l(int(h[i:i+2],16)) for i in (0,2,4)]
    l=0.4122214708*r+0.5363325363*g+0.0514459929*b; m=0.2119034982*r+0.6806995451*g+0.1073969566*b; s=0.0883024619*r+0.2817188376*g+0.6299787005*b
    l,m,s=[x**(1/3) for x in (l,m,s)]
    L=0.2104542553*l+0.7936177850*m-0.0040720468*s; a=1.9779984951*l-2.4285922050*m+0.4505937099*s; b2=0.0259040371*l+0.7827717662*m-0.8086757660*s
    return L, math.hypot(a,b2), math.degrees(math.atan2(b2,a))%360
def oklch2hex(L,C,H):
    a=C*math.cos(math.radians(H)); b=C*math.sin(math.radians(H))
    l=(L+0.3963377774*a+0.2158037573*b)**3; m=(L-0.1055613458*a-0.0638541728*b)**3; s=(L-0.0894841775*a-1.2914855480*b)**3
    r=4.0767416621*l-3.3077115913*m+0.2309699292*s; g=-1.2684380046*l+2.6097574011*m-0.3413193965*s; bb=-0.0041960863*l-0.7034186147*m+1.7076147010*s
    return '#%02x%02x%02x'%(l2s(r),l2s(g),l2s(bb))
blue={50:'f3f8ff',100:'e4f0ff',200:'c8deff',300:'9fc6fa',400:'74b2f5',500:'3fa0f0',600:'2c74be',700:'20558d',800:'173d67',900:'102950',950:'0a1a33'}
oldg={50:'edfcf0',100:'dbf8e0',200:'bcf2c7',300:'99e8ab',400:'79e094',500:'5cd680',600:'43b265',700:'2b8448',800:'206335',900:'154624',950:'0c2b15'}
aL,aC,aH=hex2oklch('5cd680')
bL6,bC6,_=hex2oklch(blue[600])
out={}
for st,hx in blue.items():
    L,C,_=hex2oklch(hx)
    # lightness: same relative position between white(1) and black(0) around the anchor
    if L>=bL6: nL=aL+(L-bL6)/(1-bL6)*(1-aL)
    else: nL=aL*L/bL6
    nC=aC*(C/bC6) if st<=600 else aC*(C/bC6)
    if st<600: nC=min(nC,aC)
    out[st]=oklch2hex(nL,nC,aH) if st!=600 else '#5cd680'
def lum(h):
    r,g,b=[s2l(int(h[i:i+2],16)) for i in (1,3,5)]; return .2126*r+.7152*g+.0722*b
for st in sorted(out): 
    c=(1.05)/(lum(out[st])+.05); print(st,out[st],'old',oldg[st],'white %.2f'%c,'navy %.2f'%((lum(out[st])+.05)/(lum('#000128')+.05)))
