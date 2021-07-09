# add-or-update-json-properties

An action for editing or adding new property values in a json file.  The property takes in an array of changes to make.  If the action finds the property it will update the value and if the property does not exist it will add it.

## Inputs

| Parameter                     | Is Required | Description                                                                                                                                                                                   |
| ----------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path-to-json-file`           | true        | The path and name of the json file to update: <br/>  *./src/MyProject/appsettings.json*                                                                                                       |
| `properties-to-update-or-add` | true        | A json-parseable array of key value pairs to update the json with.  The kvp is the json property that should be updated (nested properties are strings separated with '.') and the new value. |
| `space`                       | false       | The number of space characters to use as whitespace for indentation when the json file is saved.  Defaults to 2.                                                                              |

## Example

If you start with this json:
```json
{
  "ErrorUrl": "/dev-exceptions.html",
  "ConnectionStrings": {
    "SQL": "Server=tcp:localhost;Initial Catalog=MyDB;Integrated Security=true;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Trace"
    }
  }
}
```

And execute this workflow:
```yml
jobs:
  deploy-prod:
    runs-on: [ubuntu-20.04]
    steps:
      - uses: actions/checkout@v2

      - name: Update appsettings.json with Prod Values
        uses: im-open/add-or-update-json-properties@v1.0.0
        with:
          path-to-json-file: './src/MyApp/appsettings.json'
          properties-to-update-or-add: |
            [
              {"ErrorUrl": "/error.html"},
              {"ConnectionStrings.SQL": "${{ secrets.SQL_CONN_STR}}"},
              {"Logging.LogLevel.Default": "Warning"},
              {"New.Prop.ThatDoesNotExist": "Wahoo!"}
            ]
          space: 4
```

The resulting appsettings.json file will look like this:
```json
{
    "ErrorUrl": "/error.html",
    "ConnectionStrings": {
        "SQL": "****whatever_the_secret_value_is****"
    },
    "Logging": {
        "LogLevel": {
            "Default": "Warning"
        }
    },
    "New": {
        "Prop": {
            "ThatDoesNotExist": "Wahoo!"
        }
    }
}
```

## Recompiling

If changes are made to the action's code in this repository, or its dependencies, you will need to re-compile the action.

```sh
# Installs dependencies and bundles the code
npm run build

# Bundle the code (if dependencies are already installed)
npm run bundle
```

These commands utilize [esbuild](https://esbuild.github.io/getting-started/#bundling-for-node) to bundle the action and
its dependencies into a single file located in the `dist` folder.

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/master/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2021, Extend Health, LLC. Code released under the [MIT license](LICENSE).
