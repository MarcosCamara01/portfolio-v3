# Fonts

Subset instances of Google Fonts files, both under the SIL Open Font License 1.1.

| File                       | Source                             | Instance                                       |
| -------------------------- | ---------------------------------- | ---------------------------------------------- |
| `archivo-black-wdth.woff2` | Archivo (variable, latin subset)   | `wght` pinned to 900, `wdth` limited to 62–100 |
| `work-sans.woff2`          | Work Sans (variable, latin subset) | `wght` limited to 400–700                      |

Regenerate with fontTools:

```bash
pip install fonttools brotli
python -c "from fontTools.ttLib import TTFont; from fontTools.varLib import instancer; f = instancer.instantiateVariableFont(TTFont('Archivo.woff2'), {'wght': 900, 'wdth': (62, 100)}); f.flavor = 'woff2'; f.save('archivo-black-wdth.woff2')"
```
