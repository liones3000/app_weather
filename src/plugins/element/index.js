import Vue from "vue";
import lang from "element-ui/lib/locale/lang/en";
import locale from "element-ui/lib/locale";
import "element-ui/lib/theme-chalk/index.css";

import {
  Container,
  Button,
  Card,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  Autocomplete,
  Alert,
  Row,
  Col,
  Link,
  Loading
} from "element-ui";

const elements = [
  Container,
  Button,
  Card,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  Autocomplete,
  Alert,
  Row,
  Col,
  Link,
  Loading
];

locale.use(lang);

elements.forEach(el => Vue.use(el, { locale }));
