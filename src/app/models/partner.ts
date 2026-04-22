export class ResPartner {
    static model = 'res.partner';
    static fields = {
        "name": 'text',
        "email": 'text',
        "lang": 'combo',
        "street": 'text',
        "zip": 'text',
        "city": 'text',
        "country_id": 'combo',
        "birthday": 'date',
        "position": 'text',
        "trikot_num": 'text',
        "trikot_name": 'text',
        "licenced": 'text',
        "ref_licence": 'text',
        "member_status": 'text',
        "partner_group_ids": 'combo'
    };
    static fields_changeable = [
        "name",
        "street",
        "zip",
        "city",
        "country_id",
        "birthday",
        "lang"
    ];
    static fields_display_mapper = {
        'country_id': (c) => { return c[1];},
        'partner_group_ids': (c) => null,
        'birthday': (d) => (d? d.split(" ")[0] : d),
    }
}