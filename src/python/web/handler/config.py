# Copyright 2017, Inderpreet Singh, All rights reserved.

from bottle import HTTPResponse
from urllib.parse import unquote
from json import dumps, load

from common import overrides, Config, ConfigError
from ..web_app import IHandler, WebApp
from ..serialize import SerializeConfig


class ConfigHandler(IHandler):
    def __init__(self, config: Config):
        self.__config = config

    @overrides(IHandler)
    def add_routes(self, web_app: WebApp):
        web_app.add_handler("/server/config/get", self.__handle_get_config)
        # The regex allows slashes in values
        web_app.add_handler(
            "/server/config/set/<section>/<key>/<value:re:.+>", self.__handle_set_config
        )
        web_app.add_handler("/server/config/set", self.__handle_set_config_all)

    def __handle_get_config(self):
        out_json = SerializeConfig.config(self.__config)
        info = load(out_json)
        info["remote_password"] = "********"
        out_json = dumps(info)
        return HTTPResponse(body=out_json)

    def __handle_set_config_all(self, request: str):
        if not request:
            return HTTPResponse(body="Request is empty", status=400)
        request = json.loads(request)
        for section, section_dict in request.items():
            for key, value in section_dict.items():
                response = self.__handle_set_config(section, key, value)
                if response.status_code != 200:
                    return response
        return HTTPResponse(body="All config values set successfully")

    def __handle_set_config(self, section: str, key: str, value: str):
        # value is double encoded
        value = unquote(value)

        if not self.__config.has_section(section):
            return HTTPResponse(
                body="There is no section '{}' in config".format(section), status=400
            )
        inner_config = getattr(self.__config, section)
        if not inner_config.has_property(key):
            return HTTPResponse(
                body="Section '{}' in config has no option '{}'".format(section, key),
                status=400,
            )
        try:
            inner_config.set_property(key, value)
            return HTTPResponse(body="{}.{} set to {}".format(section, key, value))
        except ConfigError as e:
            return HTTPResponse(body=str(e), status=400)
