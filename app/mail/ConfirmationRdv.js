
const { getDictionnaire } = require('../languages')
const moment = require('moment')
exports.ConfirmationRdv = (rdv,language) => {
    const dictionnaire = getDictionnaire(language);
    const Weekday = ()=>{
        return [dictionnaire.Week.sunday, dictionnaire.Week.monday, dictionnaire.Week.tuesday, dictionnaire.Week.wednesday,
        dictionnaire.Week.thursday, dictionnaire.Week.friday, dictionnaire.Week.saturday];
    
    }
    const Months = ()=>{
        return [dictionnaire.Month.january,dictionnaire.Month.february,dictionnaire.Month.march,
        dictionnaire.Month.april,dictionnaire.Month.may,dictionnaire.Month.june,dictionnaire.Month.july,
        dictionnaire.Month.august,dictionnaire.Month.september,dictionnaire.Month.october,dictionnaire.Month.november,dictionnaire.Month.december
        ];
    }
    function DateFormat(date,showMinutes){
        let local = moment(date)
        let weekday = Weekday();
        let months = Months();
        return `${weekday[local.day()]} ${local.date()} ${months[local.month()]} ${local.year()} ${showMinutes ? `à ${local.hour()}h${local.minute()<10?"0":""}${local.minute()}`:""}`
    }


    
    return `
        <div style="width: 100%; height: 100%; display: flex;font-size:18px; text-color:#000000;">
            <div style="width:50%; display: grid; background-color: #E4DDD3; border-radius: 50px 0px 0px 50px;">
                <table align="center" width="75%">
                    <tr>
                        <th>
                            <div style="margin: 56px auto 0 auto; text-align: center; width:fit-content ">
                                <img src="https://i.ibb.co/mcZGNkk/logobig.png" alt={"logo"} style="  width: 188px; height:157px;"/>
                            </div>
                        </th>
                    </tr>
                </table>  
                
                <div style="margin-top: 60px; text-align: center;">${dictionnaire.Mail.bonjour} ${rdv.CompteClient.firstname}</div>
                <div style="margin-top: 30px; text-align: center;">${dictionnaire.Mail.confirm_rdv}</div>
                
                <div style="margin-top: 25px; font-weight: bold; font-size: 32px; text-align:center">${DateFormat(rdv.DateDebut,true)}</div>


                <div style="margin-top: 25px; text-align:center"><a style="font-weight: bold">${dictionnaire.expert}</a> ${rdv.CompteExpert.firstname} ${rdv.CompteExpert.lastname.toUpperCase()}</div>
                <div style="text-align:center"><a style="font-weight: bold">${dictionnaire.motif}</a> ${rdv.type === 0 ? dictionnaire.suivi : dictionnaire.first_suivi }</div>
                
                <div style="margin-top: 19px; font-size: 20px; text-align:center">${dictionnaire.Mail.adress}</div>
                <div style="margin-top: 19px; font-size: 16px; text-align:center">Delphine Langlois - Soins La Garenne-Colombes</div>
                <div style="font-size: 16px; text-align:center">72 ter rue Sartoris</div>
                <div style="font-size: 16px; text-align:center">92250 La Garenne Colombes</div>
                ​<div style="font-weight: bold; margin-top: 30px; text-align: center;">${dictionnaire.Mail.join.toUpperCase()}</div>

                <table align="center" width="75%">
                    <tr>
                        <th>
                            <div style="margin: 0 auto; text-align: center; width:fit-content">
                                <div style="display: flex; gap: 16px; ">
                                    <div style="margin:0 10px 0px 10px"><a href="https://www.tiktok.com/@po.skin_?is_from_webapp=1&sender_device=pc" target="_blank" > <img src="https://i.ibb.co/7JhL7KK/tiktok.png" alt={"tiktok"}  /></a></div>
                                    <div style="margin:0 10px 0px 10px"><a href="https://instagram.com/po.skin__?igshid=MzRlODBiNWFlZA==" target="_blank"> <img src="https://i.ibb.co/2hQkLVq/instagram.png" alt={"instagram"}  /></a></div>
                                    <div style="margin:0 10px 0px 10px"><a href="https://www.pinterest.fr/poskinnn/?invite_code=20394619d86b4527a76a7cb5758afad2&sender=1093671228167842742" target="_blank"> <img src="https://i.ibb.co/MRhzCK1/pinterest.png"  alt={"pinterest"} /></a></div>
                                </div>
                            </div>
                        </th>
                    </tr>
                </table> 

            </div>
            <div style="width:50%;">
                <div style="width:100%; height:100%"><img src="https://i.ibb.co/fY5zJLT/confirmationrdv.png" alt={"confirmationrdv"} style="height:100%"/></div>
            </div>

        </div>`
}

