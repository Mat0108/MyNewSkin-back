
const { getDictionnaire } = require('../languages')

exports.ConfirmationClient = (firstname,userId,language) => {
    const dictionnaire = getDictionnaire(language);
    return `<div style="width: 100%; height: 100%; display: flex;font-size:18px; text-color:#000000;">
            <div style="width:50%; display: grid; background-color: #E4DDD3; border-radius: 50px 0px 0px 50px;">
                <table align="center" width="75%">
                <tr>
                    <th>
                        <div style="margin: 56px auto 0 auto; text-align: center; width:fit-content ">
                            <img src="https://i.ibb.co/mcZGNkk/logobig.png" alt={"logo"} style="  width: 125px; height:104px;"/>
                        </div>
                    </th>
                    </tr>
                </table>  
                <div style="font-size: 36px; font-weight: bold; margin-top: 30px; text-align: center;">${dictionnaire.Mail.welcome}</div>
                <div style="margin-top: 20px; text-align: center;">${dictionnaire.Mail.bonjour} ${firstname}</div>
                
                <div style="width:80%; margin-left:10%; margin-top: 32px; text-align: center;">${dictionnaire.Mail.textconfirmation1}</div>
                <div style="width:80%; margin-left:10%; text-align: center;">${dictionnaire.Mail.textconfirmation2}</div>
                <div style="width:80%; margin-left:10%; text-align: center;">${dictionnaire.Mail.textconfirmation3}</div>
                
                <table align="center" width="75%">
                <tr>
                    <th>
                        <div style="margin: 0 auto; text-align: center; width:fit-content">
                        <div style="margin-top: 30px; display: flex;"><a href="https://po-skin.fr/Activate/${userId}" target="_blank" style="background-color: #264C4D;color: #FFFFFF;padding: 8px 16px 2px 16px;border-radius: 8px;">${dictionnaire.Mail.confirm}</a></div>
                
                        </div>
                    </th>
                    </tr>
                </table>    
                <div style="font-weight: bold; margin-top: 30px; text-align: center;">${dictionnaire.Mail.join.toUpperCase()}</div>
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
                <div style="width:100%; height:100%"><img src="https://i.ibb.co/CsHFwtw/Confirmation.png" alt={"logo"} style="height:100%"/></div>
            </div>

        </div>`
}

