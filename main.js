$(function(){
    vaildation.init({
        formId: 'form1',
        submit: false,
        success: function(){
            
        },
        rules: [
            {
                selector: 'input[name="realName"]',
                rule: {
                    rangeLength: {
                        minLength: 1,
                        maxLength: 10
                    }
                }
            },
            {
                selector: 'input[name="sexy"]',
                rule: {
                    required: true
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
                selector: 'input[name="email"]',
                rule:　{
                    required: true,
                    email: true
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
                selector: 'input[name="birthday"]',
                rule: {
                    required: true,
                    dateISO: true
                }
            },
            {
                selector: 'input[name="hasBaby"]',
                rule: {
                    required: true
                }
            }
        ]
    }); 
});
