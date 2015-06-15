$(function(){
    vaildation.init({
        formId: 'form1',
        submit: false,
        success: function(){
        },
        error: function($elem) {
        },
        rules: [
            {
                selector: 'input[name="rangeLength"]',
                rule: {
                    rangeLength: {
                        minLength: 1,
                        maxLength: 10
                    },
                    ajax:　{
                        url: 'http://www.baidu.com'
                    }
                }
            },
            {
                selector: 'input[name="minLength"]',
                rule: {
                    minLength: 6,
                    ajax:　{
                        url: 'http://www.sina.com'
                    }
                }
            },
            {
                selector: 'input[name="maxLength"]',
                rule: {
                    maxLength: 2
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
                    zipCode: true
                }
            },
            {
                selector: 'input[name="date"]',
                rule: {
                    required: true,
                    dateISO: true
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
                    required: true,
                    email: true
                }
            },
            {
                selector: 'input[name="idCard"]',
                rule: {
                    required: true,
                    idCard: true
                }
            },
            {
                selector: 'input[name="url"]',
                rule: {
                    url: true
                }
            },
            {
                selector: 'input[name="number"]',
                rule: {
                    number: true
                }
            },
            {
                selector: 'input[name="digits"]',
                rule: {
                    digits: true
                }
            },
            {
                selector: 'input[name="regExp"]',
                rule: {
                    regExp: {
                        exp: /^[0-9]*$/,
                        errorMsg: '此处正则只能匹配数字!'
                    }
                }
            }
        ]
    }); 
});
