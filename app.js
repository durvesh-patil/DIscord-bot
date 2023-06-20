const { Client, GatewayIntentBits, ModalBuilder, Events, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, messageLink, GuildMemberRoleManager, Collection } = require('discord.js')
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions] });
const dotenv = require("dotenv")
const fs = require('fs')



dotenv.config({ path: './config.env' })

const token = process.env.BOT_TOKEN
const roleId = process.env.ROLE_ID
const roleId3x = process.env.ROLE_ID_LIMITER
const roleId2x = process.env.ROLE_ID_2X
const roleId1x = process.env.ROLE_ID_1X
console.log(roleId2x, roleId1x)

const userVotes = new Map();
const commandUsages = new Map();


const maxUsage = 3;
const imageURL = 'https://images.dog.ceo/breeds/terrier-toy/n02087046_9864.jpg';



// Calculate the total number of votes
const addRoleToUser = (voteCounts, member, role) => {
    let winningOption
    const totalVotes = Object.values(voteCounts).reduce((total, count) => total + count, 0);
    // console.log(totalVotes);

    if (totalVotes === 0) return winningOption = 'REJECTED ❌❌';


    // Calculate the percentage of votes for each option
    const percentageOption1 = (voteCounts.option1 / totalVotes) * 100;
    const percentageOption2 = (voteCounts.option2 / totalVotes) * 100;
    voteCounts.option1 = percentageOption1
    voteCounts.option2 = percentageOption2



    // Determine the winning option

    if (percentageOption1 >= 69) {
        winningOption = 'APPROVED ✅✅';
        member.roles.add(role);

    } else if (percentageOption2 >= 69) {
        winningOption = 'REJECTED ❌❌';
    }
    else if (percentageOption1 === percentageOption2) {
        winningOption = 'REJECTED ❌❌';
    }


    // console.log(`Winning option with 69% or more votes: ${winningOption}`);
    return winningOption
}





// EVENT LISTNERS
client.on('ready', () => {
    try {

        console.log(`Logged in as ${client.user.tag}`);
    } catch (err) {
        console.log(err);
    }


});

// APPLY BUTTON CREATE
client.on('messageCreate', (message) => {
    // console.log(message);
    if (message.content === '!test') {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Apply Now\nClick the button below to create your application.\n')
            .setDescription('RULES:\n Max 3 Applications per user.\n Recheck your application before submitting.\n Results will be drawn in 72 hours from the moment of submission.\nGoodluck!.')
            .setFooter({ text: '\nPowered by Saffire', iconURL: `${imageURL}` });

        // Create the button
        const applyButton = new ButtonBuilder()
            .setCustomId('applyButton')
            .setLabel('Apply!')
            .setStyle(ButtonStyle.Success);

        const actionRow = new ActionRowBuilder().addComponents(applyButton);

        // Send the embed message with the button
        message.channel.send({ embeds: [embed], components: [actionRow] });

    }



})



//MODAL CREATE
client.on(Events.InteractionCreate, async (interaction) => {
    try {

        if (!interaction.isButton()) return;
        // console.log(usersData.find(obj => obj.userId == interaction.user.id).userUsage);

        if (interaction.customId === 'applyButton') {
            const guild = interaction.guild;
            const memberId = interaction.user.id;
            const member = guild.members.cache.get(memberId);

            if (member.roles.cache.some(role => role.name === 'Elite')) {
                return interaction.reply({ content: 'You are already approved -_-', ephemeral: true })
            }



            // let commandUsageCount = commandUsages.get(interaction.user.id) || 0;
            if (member.roles.cache.some(role => role.name === '3x Applied')) {
                await interaction.reply({ content: 'You have reached the limit for applying the form.', ephemeral: true });
                return;
            }



            // Create the modal
            const modal = new ModalBuilder()
                .setCustomId('myModal')
                .setTitle('Apply Form');



            // Create the text input components
            const twitterHandleInput = new TextInputBuilder()
                .setCustomId('twitterHandleInput')
                // The label is the prompt the user sees for this input
                .setLabel("Twitter Username (@)")
                // Short means only a single line of text
                .setStyle(TextInputStyle.Short);



            const userAbout = new TextInputBuilder()
                .setCustomId('userAbout')
                .setLabel("Tell us about yourself ?")
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(750)

            const skillsAbout = new TextInputBuilder()
                .setCustomId('skillsAbout')
                .setLabel("Flex your skills & contributions to ecosystem")
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(750)

            const communityAbout = new TextInputBuilder()
                .setCustomId('communityAbout')
                .setLabel("How can you enrich community experience ?  ")
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(750)


            // An action row only holds one text input,
            // so you need one action row per text input.
            const firstActionRow = new ActionRowBuilder().addComponents(twitterHandleInput);
            // const secondActionRow = new ActionRowBuilder().addComponents(discordId);
            const thirdActionRow = new ActionRowBuilder().addComponents(userAbout);
            const fourthActionRow = new ActionRowBuilder().addComponents(skillsAbout);
            const fifthActionRow = new ActionRowBuilder().addComponents(communityAbout);
            // Add inputs to the modal
            modal.addComponents(firstActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

            // Show the modal to the user
            await interaction.showModal(modal);


        }





    } catch (err) {
        console.log(err);
    }
})







//MODAL SUMBIT
client.on(Events.InteractionCreate, async interaction => {
    try {

        //interaction.user.id =  '1232131230517202972'
        if (!interaction.isModalSubmit()) return;

        if (interaction.customId === 'myModal') {



            const guild = interaction.guild;
            const memberId = interaction.user.id;
            const member = guild.members.cache.get(memberId);
            const role = guild.roles.cache.get(roleId);
            const role3x = guild.roles.cache.get(roleId3x);
            const role2x = guild.roles.cache.get(roleId2x);
            const role1x = guild.roles.cache.get(roleId1x);

            if (!member.roles.cache.some(role => role.name === '1x Applied')) {
                console.log('hello');
                member.roles.add(role1x)
            } else if (!member.roles.cache.some(role => role.name === '2x Applied')) {
                member.roles.add(role2x)
            } else if (!member.roles.cache.some(role => role.name === '3x Applied')) {
                member.roles.add(role3x)
            }


            // let commandUsagesCount = commandUsages.get(interaction.user.id) || 0;
            // commandUsagesCount++;
            // commandUsages.set(interaction.user.id, commandUsagesCount)
            // console.log(commandUsagesCount);

            // if (commandUsagesCount === maxUsage) {
            //     member.roles.add(limiterRole)

            // }



            // console.log(interaction);
            const twitterIdOutput = interaction.fields.getTextInputValue('twitterHandleInput')
            const userAboutOutput = interaction.fields.getTextInputValue('userAbout')
            const skillsAboutOutput = interaction.fields.getTextInputValue('skillsAbout')
            const communityAboutOutput = interaction.fields.getTextInputValue('communityAbout')

            let userOutputEmbed, actionRow, approveButton, rejectButton

            userOutputEmbed = new EmbedBuilder()
                .setColor('#800080')
                .setTitle(`PROFILE:`)
                .setAuthor({ name: `\n`, inline: false })
                .setDescription(`DISCORD ID : <@${interaction.user.id}>\n\nTwitter : https://twitter.com/${twitterIdOutput} `)
                .addFields(
                    { name: '\n\n', value: '\n\n' },
                    { name: 'Tell us about yourself :', value: `${userAboutOutput}`, inline: false },
                    { name: '\n\n', value: '\n\n' },
                    { name: 'Flex your skills & contributions to ecosystem :', value: `${skillsAboutOutput}`, inline: false },
                    { name: '\n\n', value: '\n\n' },
                    { name: 'How can you enrich community experience :', value: `${communityAboutOutput}`, inline: false },
                    { name: '\n\n', value: '\n\n' }
                )
                .setThumbnail(`${interaction.user.displayAvatarURL()}`)
                .setTimestamp()




            approveButton = new ButtonBuilder()
                .setCustomId('approve')
                .setLabel('APPROVE')
                .setStyle(ButtonStyle.Primary);

            rejectButton = new ButtonBuilder()
                .setCustomId('reject')
                .setLabel('REJECT')
                .setStyle(ButtonStyle.Danger);

            actionRow = new ActionRowBuilder()
                .addComponents(approveButton, rejectButton);


            //ROLE DOES NOT EXIST IN CACHE DIRECTLY IN THIS FUCNTION
            if (member.roles.cache.some(role => role.name === '1x Applied')) {
                console.log('hallooooo');
                userOutputEmbed.addFields({ name: "\n\n", value: 'This user has reapplied' }).setFooter({ text: '\n Powered by SAFFIRE', iconURL: `${imageURL}` })



            } else {
                userOutputEmbed.setFooter({ text: ` Powered by SAFFIRE `, iconURL: `${imageURL}` })



            }




            // if (commandUsagesCount === 1) {
            //     userOutputEmbed.setFooter({ text: ` Powered by SAFFIRE `, iconURL: `${imageURL}` })//.setThumbnail('https://images.dog.ceo/breeds/terrier-toy/n02087046_9864.jpg')


            // } else if (commandUsagesCount >= 2) {
            //     userOutputEmbed.addFields({ name: "\n\n", value: 'This user has reapplied' }).setFooter({ text: '\n Powered by SAFFIRE', iconURL: `${imageURL}` })

            // }




            const targetChannel = client.channels.cache.get(process.env.CHANNEL_ID)

            const pollMessage = await targetChannel.send({ embeds: [userOutputEmbed], components: [actionRow] });

            const voteCounts = {
                option1: 0,
                option2: 0,
            };



            const filter = (interaction) => interaction.isButton() && interaction.message.id === pollMessage.id;
            const collector = pollMessage.createMessageComponentCollector({ filter }); // Adjust the time according to your needs

            const threeDaysDuration = 20 * 1000;

            setTimeout(() => {
                collector.stop('Collector expired');
            }, threeDaysDuration);

            collector.on('collect', (interaction) => {
                const { customId, user } = interaction;

                if (!member.roles.cache.some(role => role.name === 'Elite')) {
                    return interaction.reply({ content: `You need "Elite" role to vote `, ephemeral: true })
                }


                if (userVotes.has(user.id)) {
                    interaction.reply({ content: 'You have already voted', ephemeral: true })
                    return;
                }

                // Process the vote based on the customId
                if (customId === 'approve') {
                    interaction.reply({ content: `You have selected 'APPROVE'`, ephemeral: true });
                    // Process vote for Option 1
                    voteCounts.option1++
                } else if (customId === 'reject') {
                    interaction.reply({ content: `You have selected 'REJECT'`, ephemeral: true });
                    // Process vote for Option 2
                    voteCounts.option2++
                }



                userVotes.set(user.id, true);

                //  interaction.reply(`You voted for ${customId}`);
            });

            collector.on('end', (_, reason) => {

                if (reason === 'Collector expired') {



                    const winningOption = addRoleToUser(voteCounts, member, role)
                    console.log(winningOption);


                    // Disable the buttons after the collection ends
                    approveButton.setDisabled(true);
                    rejectButton.setDisabled(true);
                    actionRow.components = [approveButton, rejectButton];
                    pollMessage.edit({ components: [actionRow] });

                    //pollMessage.delete()
                    let resultEmbed;
                    if (winningOption.startsWith('APPROVED')) {


                        resultEmbed = new EmbedBuilder().setColor('Green').setTitle(`Results for user :  `).setDescription(`<@${interaction.user.id}>`).addFields({ name: 'Approve\n', value: `${voteCounts.option1} %` }).addFields({ name: 'Reject\n', value: `${voteCounts.option2} %` }, { name: '\u200B', value: '\u200B' }, { name: 'Result', value: `${winningOption}` }).setFooter({ text: "Special role will be granted starting today" });
                    } else {
                        resultEmbed = new EmbedBuilder().setColor('Red').setTitle(`Results for user :  `).setDescription(`<@${interaction.user.id}>`).addFields({ name: 'Approve\n', value: `${voteCounts.option1} %` }).addFields({ name: 'Reject\n', value: `${voteCounts.option2} %` }, { name: '\u200B', value: '\u200B' }, { name: 'Result', value: `${winningOption}` });

                    }

                    targetChannel.send({ embeds: [resultEmbed] });

                    userVotes.clear();
                }
            });

            interaction.reply({ content: `<@${interaction.user.id}> successfully applied`, ephemeral: true })

        }
    } catch (err) {
        console.log(err);

    }
});








client.login(token);
