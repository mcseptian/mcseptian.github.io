import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";
import Card from "./Card.svelte";

const articleMock = {
  published: "2019-12-27T16:07:00+07:00",
  updated: "2021-09-18T14:19:44+07:00",
  url: "http://mcseptian.blogspot.com/2019/12/javascript-function-syntax.html",

  title: "Javascript: Function Syntax",
  content:
    '<pre><code class="hljs styling: js">\n/**\n* Function as Declarations\n*/\n\nfunction square(a) {\n    return a * a;\n}\n\n/**\n* Anonymous Function as Expressions\n*/\n\nlet square = function (a) { return a * a; }\n\n/**\n* Arrow Function as Expressions\n*/\n\nlet square = (a) => { return a * a }\n\n/**\n* Arrow Function as Expressions\n* The parentheses that define function argument and\n* curly braces that define function statement could be omitted,\n* only if there is one argument and one statement exist.\n* This expression return on execution by default,\n* so you could omit `return` keyword too.\n*/\n\nlet square = a => a * a\n\n/**\n* Anonymous Function as Immediately-Invoked Function Expressions\n* The first pair of parentheses define function expression.\n* The last pair of parentheses invoke the function.\n* You could place argument value inside the trailing parentheses.\n*/\n\n(function(a) {\n    return a * a;\n})()\n\n/**\n* Anonymous Function as Immediately-Invoked Function Expressions\n* The first parentheses that define function argument could be omitted,\n* only if there is one unary operator exist.\n*/\n\n+function (a) {\n    return a * a;\n}();\n\n-function (a) {\n    return a * a;\n}();\n\n!function (a) {\n    return a * a;\n}();\n\n~function (a) {\n    return a * a;\n}();\n\nvoid function (a) {\n    return a * a;\n}();\n\n/**\n* Arrow Function as Immediately-Invoked Function Expressions\n* The first pair of parentheses define function expression.\n* The last pair of parentheses invoke the function.\n* You could place argument value there.\n*/\n\n(a => a * a)()\n</code>\n</pre>Hindari menggunakan iife untuk mendapatkan function scope.<br />\n<pre><code class="hljs styling: js">\nfor (var i = 1; i <= 5; i++) {\n    void function (step) {\n        setTimeout(function() {\n            console.log(\'I reached level \' + step);\n        }, 1000 * i);\n    }(i);\n}\n</code>\n</pre>Gunakan variable scope saja!<br />\n<pre><code class="hljs styling: js">\nfor (let i = 1; i <= 5; i++) {\n    setTimeout(function () {\n        console.log(\'I reached level \' + i);\n    }, 1000 * i);\n}\n</code>\n</pre>',

  replies: {
    totalItems: "0",
    selfLink:
      "https://www.googleapis.com/blogger/v3/blogs/3668625331368011796/posts/8061929743186790782/comments",
  },
  labels: ["Coding", "JS"],
};

test("rendered properly", () => {
  const { getByRole } = render(Card, { article: articleMock });
  const article = getByRole("article");
  expect(article).toBeInTheDocument();
});
