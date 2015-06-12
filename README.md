# pana-vaildation
validation framework for you.jd.com

## Examples

```javascript
/*
【集成到libra后的依赖关系描述】: jquery, constant(error msg会放在此处), site(异步校验接口来源) 
 Tips: 目前checkbox,radio,select仅支持required校验。有更多校验场景时，请提出你的需求。
*/
vaildation.init({
        formId: 'form1',
        trigger: 'change', //缺省值为change,可选值为submit,submit时仅通过提交按钮触发校验
        submit: false, // 表单静态数据校验成功，是否提交。
        success: function(){
            /*
            前端校验成功回调，不包括异步校验
            应用场景，静态数据校验成功后，异步校验可以放在这里做。
            时间关系，更为优雅的异步校验方案，后期更新。
            examples:
            rule:　{
                ajax: {
                        url: ..,
                        errorMsg: ..
                }
            }
            */
        },
        rules: [
            {
                selector: 'input[name="rangeLength"]',
                rule: {
                    rangeLength: { //字符长度区间
                        minLength: 1,
                        maxLength: 10
                    }
                }
            },
            {
                selector: 'input[name="minLength"]',
                rule: {
                    minLength: 6 //最小长度
                }
            },
            {
                selector: 'input[name="maxLength"]',
                rule: {
                    maxLength: 2 //最大长度
                }
            },
            {
                selector: 'select[name="state"]',
                rule:　{
                    required: true
                }
            },
            {
                selector: 'select[name="city"]',
                rule:　{
                    required: true
                }
            },
            {
                selector: 'input[name="address"]',
                rule:　{
                    required: true
                }
            },
            {
                selector: 'input[name="zipCode"]',
                rule:　{
                    zipCode: true //邮箱校验
                }
            },
            {
                selector: 'input[name="date"]',
                rule: {
                    required: true,
                    dateISO: true //日期格式校验
                }
            },
            {
                selector: 'input[name="sexy"]',
                rule: {
                    required: true
                }
            },
            {
                selector: 'input[name="domain"]',
                rule: {
                    required: true 
                }
            },
            {
                selector: 'input[name="email"]',
                rule: {
                    email: true //email
                }
            },
            {
                selector: 'input[name="idCard"]',
                rule: {
                    idCard: true //身份证号
                }
            },
            {
                selector: 'input[name="url"]',
                rule: {
                    url: true //严格的url校验，需要带协议
                }
            },
            {
                selector: 'input[name="number"]',
                rule: {
                    number: true //有效数字
                }
            },
            {
                selector: 'input[name="digits"]',
                rule: {
                    digits: true //数字
                }
            },
            {
                selector: 'input[name="regExp"]',
                rule: {
                    regExp: {
                        exp: /^[0-9]*$/,  //正则表达式
                        errorMsg: '此处正则只能匹配数字!' //出错提示
                    }
                }
            }
        ]
    }); 
```
