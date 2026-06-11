"""
KivyMD 1.x → 2.x compatibility shims.
MDFlatButton, MDRaisedButton → MDButton (text/elevated style)
MDProgressBar → MDLinearProgressIndicator
"""

from kivymd.uix.button import MDButton, MDButtonText
from kivymd.uix.progressindicator import MDLinearProgressIndicator

_STRIP_KWARGS = {'theme_text_color', 'text_color'}


def _build_button(style, text='', **kwargs):
    for k in list(kwargs):
        if k in _STRIP_KWARGS:
            del kwargs[k]
    btn = MDButton(style=style, **kwargs)
    if text:
        btn.add_widget(MDButtonText(text=text))
    return btn


class MDFlatButton(MDButton):
    def __init__(self, text='', **kwargs):
        for k in list(kwargs):
            if k in _STRIP_KWARGS:
                del kwargs[k]
        super().__init__(style='text', **kwargs)
        if text:
            self.add_widget(MDButtonText(text=text))


class MDRaisedButton(MDButton):
    def __init__(self, text='', **kwargs):
        for k in list(kwargs):
            if k in _STRIP_KWARGS:
                del kwargs[k]
        super().__init__(style='elevated', **kwargs)
        if text:
            self.add_widget(MDButtonText(text=text))


MDProgressBar = MDLinearProgressIndicator
